// Copyright 2025 The Ip2Region Authors. All rights reserved.
// Use of this source code is governed by a Apache2.0-style
// license that can be found in the LICENSE file.
// @Author Alan <lzh.shap@gmail.com>
// @Date   2023/07/25
// Updated by Argo Zhang <argo@live.ca> at 2025/11/21

using IP2Region.Net.Abstractions;
using IP2Region.Net.Internal;
using IP2Region.Net.XDB;
using System;
using System.Buffers.Binary;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace LINGYUN.Abp.IP2Region;

/// <summary>
/// Trình truy vấn ngoại tuyến ip2region
/// </summary>
/// <remarks>
/// Hỗ trợ hai tệp dữ liệu ngoại tuyến IPv4 và IPv6:
/// * <see cref="AbpSearcher(CachePolicy, Stream)"/>: Chỉ tải một tệp dữ liệu, khi truy vấn chọn cách so sánh theo độ dài byte của địa chỉ
///   (IPv4 là 4 byte, IPv6 là 16 byte), tức bên gọi đảm bảo tệp dữ liệu và địa chỉ truy vấn cùng phiên bản;
/// * <see cref="AbpSearcher(CachePolicy, Stream, Stream?)"/>: Đồng thời tải tệp dữ liệu IPv4 và IPv6, tự động định tuyến theo họ địa chỉ,
///   Khi không cung cấp tệp dữ liệu tương ứng với họ địa chỉ thì trả về <c>null</c> (tránh dùng sai tệp dữ liệu để phân tích ra vị trí địa lý sai).
/// 
/// Địa chỉ IPv6 ánh xạ IPv4 (ví dụ <c>::ffff:1.2.3.4</c>) sẽ được chuẩn hóa về truy vấn IPv4.
/// </remarks>
public class AbpSearcher : ISearcher
{
    private readonly ICacheStrategy _cacheStrategy;
    private readonly ICacheStrategy? _ipv6CacheStrategy;
    private readonly bool _isDualDatabase;

    /// <summary>
    /// Chỉ tải một tệp dữ liệu (IPv4 hoặc IPv6)
    /// </summary>
    /// <param name="cachePolicy">Chiến lược bộ nhớ đệm</param>
    /// <param name="xdbStream">Luồng tệp dữ liệu</param>
    public AbpSearcher(CachePolicy cachePolicy, Stream xdbStream)
        : this(cachePolicy, xdbStream, null, false)
    {
    }

    /// <summary>
    /// Đồng thời tải tệp dữ liệu IPv4 và IPv6, tự động định tuyến theo họ địa chỉ
    /// </summary>
    /// <param name="cachePolicy">Chiến lược bộ nhớ đệm</param>
    /// <param name="xdbStream">Luồng tệp dữ liệu IPv4</param>
    /// <param name="ipv6XdbStream">Luồng tệp dữ liệu IPv6, khi không cung cấp thì truy vấn IPv6 trả về <c>null</c></param>
    public AbpSearcher(CachePolicy cachePolicy, Stream xdbStream, Stream? ipv6XdbStream)
        : this(cachePolicy, xdbStream, ipv6XdbStream, true)
    {
    }

    private AbpSearcher(CachePolicy cachePolicy, Stream xdbStream, Stream? ipv6XdbStream, bool isDualDatabase)
    {
        _cacheStrategy = CacheStrategyFactory.CreateCacheStrategy(cachePolicy, xdbStream);

        _isDualDatabase = isDualDatabase;
        if (ipv6XdbStream != null)
        {
            _ipv6CacheStrategy = CacheStrategyFactory.CreateCacheStrategy(cachePolicy, ipv6XdbStream);
        }
    }

    /// <summary>
    /// <inheritdoc/>
    /// </summary>
    public int IoCount => _cacheStrategy.IoCount + (_ipv6CacheStrategy?.IoCount ?? 0);

    /// <summary>
    /// <inheritdoc/>
    /// </summary>
    public string? Search(string ipStr) => Search(IPAddress.Parse(ipStr));

    /// <summary>
    /// <inheritdoc/>
    /// </summary>
    public string? Search(IPAddress ipAddress)
    {
        // Chuẩn hóa địa chỉ IPv6 ánh xạ IPv4 về truy vấn IPv4
        if (ipAddress.IsIPv4MappedToIPv6)
        {
            ipAddress = ipAddress.MapToIPv4();
        }

        var cacheStrategy = ResolveCacheStrategy(ipAddress);
        if (cacheStrategy == null)
        {
            return null;
        }

        return SearchCore(cacheStrategy, ipAddress.GetAddressBytes());
    }

    /// <summary>
    /// <inheritdoc/>
    /// </summary>
    [Obsolete("Đã lỗi thời, vui lòng dùng phương pháp khác; Deprecated; please use Search(string) or Search(IPAddress) method.")]
    [ExcludeFromCodeCoverage]
    public string? Search(uint ipAddress)
    {
        var bytes = BitConverter.GetBytes(ipAddress);
        Array.Reverse(bytes);

        return SearchCore(_cacheStrategy, bytes);
    }

    /// <summary>
    /// Chọn tệp dữ liệu theo họ địa chỉ
    /// </summary>
    /// <remarks>
    /// Ở chế độ một tệp (chỉ tải một tệp dữ liệu) thì không định tuyến, giữ nguyên hành vi so sánh theo độ dài byte
    /// </remarks>
    private ICacheStrategy? ResolveCacheStrategy(IPAddress ipAddress)
    {
        if (ipAddress.AddressFamily == AddressFamily.InterNetworkV6)
        {
            if (_ipv6CacheStrategy != null)
            {
                return _ipv6CacheStrategy;
            }

            // Ở chế độ hai tệp mà thiếu tệp dữ liệu IPv6 thì không dùng tệp dữ liệu IPv4 để phân tích
            return _isDualDatabase ? null : _cacheStrategy;
        }

        return _cacheStrategy;
    }

    private string? SearchCore(ICacheStrategy cacheStrategy, byte[] ipBytes)
    {
        // Đặt lại bộ đếm IO
        cacheStrategy.ResetIoCount();
        _cacheStrategy.ResetIoCount();
        _ipv6CacheStrategy?.ResetIoCount();

        // Số byte của mỗi mục chỉ mục vector
        var vectorIndexSize = 8;

        // Số cột của chỉ mục vector
        var vectorIndexCols = 256;

        // Tính ra địa chỉ bắt đầu của mục chỉ mục vector.
        var il0 = ipBytes[0];
        var il1 = ipBytes[1];
        var idx = il0 * vectorIndexCols * vectorIndexSize + il1 * vectorIndexSize;

        var vector = cacheStrategy.GetVectorIndex(idx);
        var sPtr = BinaryPrimitives.ReadUInt32LittleEndian(vector.Span);
        var ePtr = BinaryPrimitives.ReadUInt32LittleEndian(vector.Span.Slice(4));

        var length = ipBytes.Length;
        var indexSize = length * 2 + 6;
        var l = 0;
        var h = (ePtr - sPtr) / indexSize;
        var dataLen = 0;
        long dataPtr = 0;

        while (l <= h)
        {
            int m = (int)(l + h) >> 1;

            var p = sPtr + m * indexSize;
            var buff = cacheStrategy.GetData(p, indexSize);

            var s = buff.Span.Slice(0, length);
            var e = buff.Span.Slice(length, length);
            if (ByteCompare(ipBytes, s) < 0)
            {
                h = m - 1;
            }
            else if (ByteCompare(ipBytes, e) > 0)
            {
                l = m + 1;
            }
            else
            {
                dataLen = BinaryPrimitives.ReadUInt16LittleEndian(buff.Span.Slice(length * 2, 2));
                dataPtr = BinaryPrimitives.ReadUInt32LittleEndian(buff.Span.Slice(length * 2 + 2, 4));
                break;
            }
        }

        var regionBuff = cacheStrategy.GetData(dataPtr, dataLen);
        return Encoding.UTF8.GetString(regionBuff.Span.ToArray());
    }

    static int ByteCompare(byte[] ip1, ReadOnlySpan<byte> ip2) => ip1.Length == 4 ? IPv4Compare(ip1, ip2) : IPv6Compare(ip1, ip2);

    static int IPv4Compare(byte[] ip1, ReadOnlySpan<byte> ip2)
    {
        var ret = 0;
        for (int i = 0; i < ip1.Length; i++)
        {
            var ip2Index = ip1.Length - 1 - i;
            if (ip1[i] < ip2[ip2Index])
            {
                return -1;
            }
            else if (ip1[i] > ip2[ip2Index])
            {
                return 1;
            }
        }
        return ret;
    }

    static int IPv6Compare(byte[] ip1, ReadOnlySpan<byte> ip2)
    {
        var ret = 0;
        for (int i = 0; i < ip1.Length; i++)
        {
            if (ip1[i] < ip2[i])
            {
                return -1;
            }
            else if (ip1[i] > ip2[i])
            {
                return 1;
            }
        }
        return ret;
    }

    /// <summary>
    /// <inheritdoc/>
    /// </summary>
    public void Dispose()
    {
        _cacheStrategy.Dispose();
        _ipv6CacheStrategy?.Dispose();
        GC.SuppressFinalize(this);
    }
}
