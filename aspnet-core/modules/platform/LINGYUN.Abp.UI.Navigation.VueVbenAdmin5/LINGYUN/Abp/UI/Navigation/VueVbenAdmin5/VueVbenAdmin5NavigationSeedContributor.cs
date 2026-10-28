using LINGYUN.Platform.Datas;
using LINGYUN.Platform.Layouts;
using LINGYUN.Platform.Menus;
using LINGYUN.Platform.Routes;
using LINGYUN.Platform.Utils;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using ValueType = LINGYUN.Platform.Datas.ValueType;

namespace LINGYUN.Abp.UI.Navigation.VueVbenAdmin5;

public class VueVbenAdmin5NavigationSeedContributor : NavigationSeedContributor
{
    private static int _lastCodeNumber = 0;
    protected ICurrentTenant CurrentTenant { get; }
    protected IGuidGenerator GuidGenerator { get; }
    protected IRouteDataSeeder RouteDataSeeder { get; }
    protected IDataDictionaryDataSeeder DataDictionaryDataSeeder { get; }
    protected IMenuRepository MenuRepository { get; }
    protected ILayoutRepository LayoutRepository { get; }
    protected AbpUINavigationVueVbenAdmin5Options Options { get; }

    public VueVbenAdmin5NavigationSeedContributor(
        ICurrentTenant currentTenant,
        IRouteDataSeeder routeDataSeeder,
        IMenuRepository menuRepository,
        ILayoutRepository layoutRepository,
        IGuidGenerator guidGenerator,
        IDataDictionaryDataSeeder dataDictionaryDataSeeder,
        IOptions<AbpUINavigationVueVbenAdmin5Options> options)
    {
        CurrentTenant = currentTenant;
        GuidGenerator = guidGenerator;
        RouteDataSeeder = routeDataSeeder;
        MenuRepository = menuRepository;
        LayoutRepository = layoutRepository;
        DataDictionaryDataSeeder = dataDictionaryDataSeeder;

        Options = options.Value;
    }

    public override async Task SeedAsync(NavigationSeedContext context)
    {
        var uiDataItem = await SeedUIFrameworkDataAsync(CurrentTenant.Id);

        var layoutData = await SeedLayoutDataAsync(CurrentTenant.Id);

        var layout = await SeedDefaultLayoutAsync(layoutData, uiDataItem);

        var latMenu = await MenuRepository.FindLastMenuAsync();

        if (int.TryParse(CodeNumberGenerator.GetLastCode(latMenu?.Code ?? "0"), out int _lastNumber))
        {
            Interlocked.Exchange(ref _lastCodeNumber, _lastNumber);
        }

        await SeedDefinitionMenusAsync(layout, layoutData, context.Menus, context.MultiTenancySides);
    }

    private async Task SeedDefinitionMenusAsync(
        Layout layout,
        Data data, 
        IReadOnlyCollection<ApplicationMenu> menus,
        MultiTenancySides multiTenancySides)
    {
        foreach (var menu in menus)
        {
            if (!menu.MultiTenancySides.HasFlag(multiTenancySides))
            {
                continue;
            }

            var menuMeta = new Dictionary<string, object?>(menu.ExtraProperties)
            {
                ["icon"] = menu.Icon ?? "",
                ["order"] = menu.Order
            };
            var roles = menu.GetRoles();

            var seedMenu = await SeedMenuAsync(
                layout:         layout,
                data:           data,
                name:           menu.Name,
                path:           menu.Url,
                code:           CodeNumberGenerator.CreateCode(GetNextCode()),
                component:      layout.Path!,
                displayName:    menu.DisplayName,
                redirect:       menu.Redirect,
                description:    menu.Description,
                parentId:       null,
                tenantId:       layout.TenantId,
                meta:           menuMeta,
                roles:          roles.Union(["admin"]).ToArray());

            await SeedDefinitionMenuItemsAsync(layout, data, seedMenu, menu.Items, multiTenancySides);
        }
    }

    private async Task SeedDefinitionMenuItemsAsync(
        Layout layout, 
        Data data, 
        Menu menu, 
        ApplicationMenuList items,
        MultiTenancySides multiTenancySides)
    {
        int index = 1;
        foreach (var item in items)
        {
            if (!item.MultiTenancySides.HasFlag(multiTenancySides))
            {
                continue;
            }

            var menuMeta = new Dictionary<string, object?>(item.ExtraProperties)
            {
                ["icon"] = item.Icon ?? "",
                ["order"] = item.Order
            };
            var roles = item.GetRoles();

            var seedMenu = await SeedMenuAsync(
                layout:         layout,
                data:           data,
                name:           item.Name,
                path:           item.Url,
                code:           CodeNumberGenerator.AppendCode(menu.Code, CodeNumberGenerator.CreateCode(index)),
                component:      item.Component.IsNullOrWhiteSpace() ? layout.Path! : item.Component,
                displayName:    item.DisplayName,
                redirect:       item.Redirect,
                description:    item.Description,
                parentId:       menu.Id,
                tenantId:       menu.TenantId,
                meta:           menuMeta,
                roles:          roles.Union(["admin"]).ToArray());

            await SeedDefinitionMenuItemsAsync(layout, data, seedMenu, item.Items, multiTenancySides);

            index++;
        }
    }

    private async Task<Menu> SeedMenuAsync(
        Layout layout,
        Data data,
        string name,
        string path,
        string code,
        string component,
        string displayName,
        string? redirect = null,
        string? description = null,
        Guid? parentId = null,
        Guid? tenantId = null,
        Dictionary<string, object?>? meta = null,
        string[]? roles = null,
        Guid[]? users = null,
        bool isPublic = false
        )
    {
        var menuMeta = new Dictionary<string, object?>();
        foreach (var item in data.Items)
        {
            menuMeta[item.Name] = item.DefaultValue;
        }
        if (meta != null)
        {
            foreach (var item in meta)
            {
                menuMeta[item.Key] = item.Value;
            }
        }
        var menu = await RouteDataSeeder.SeedMenuAsync(
            layout,
            name,
            path,
            code,
            component,
            displayName,
            redirect,
            description,
            parentId,
            tenantId,
            isPublic,
            menuMeta);

        if (roles != null)
        {
            foreach (var role in roles.Distinct())
            {
                await RouteDataSeeder.SeedRoleMenuAsync(role, menu, tenantId);
            }
        }

        if (users != null)
        {
            foreach (var user in users.Distinct())
            {
                await RouteDataSeeder.SeedUserMenuAsync(user, menu, tenantId);
            }
        }

        return menu;
    }

    private async Task<DataItem> SeedUIFrameworkDataAsync(Guid? tenantId)
    {
        var data = new Data(
            GuidGenerator.Create(),
            "UI Framework",
            CodeNumberGenerator.CreateCode(30),
            "Khung UI",
            "UI Framework",
            null,
            tenantId)
        {
            IsStatic = true,
        };

        data.AddItem(
            GuidGenerator,
            Options.UI,
            Options.UI,
            Options.UI,
            ValueType.String,
            Options.UI,
            isStatic: true);

        await DataDictionaryDataSeeder.SeedAsync(data);

        return data.FindItem(Options.UI)!;
    }

    private async Task<Layout> SeedDefaultLayoutAsync(Data data, DataItem uiDataItem)
    {
        var layout = await RouteDataSeeder.SeedLayoutAsync(
           Options.LayoutName,
           Options.LayoutPath, // Ở tầng định tuyến đã xử lý xong, chỉ cần truyền LAYOUT là tự động tham chiếu bố cục
           Options.LayoutName,
           data.Id,
           uiDataItem.Name,
           "",
           Options.LayoutName,
           data.TenantId
           );

        return layout;
    }

    private async Task<Data> SeedLayoutDataAsync(Guid? tenantId)
    {
        var data = new Data(
            GuidGenerator.Create(),
            Options.LayoutName,
            CodeNumberGenerator.CreateCode(40),
            "Ràng buộc bố cục Vben5 Admin",
            "Ràng buộc bố cục mẫu Vben5 Admin",
            null,
            tenantId)
        {
            IsStatic = true,
        };
        data.AddItem(
            GuidGenerator,
            "title",
            "Tiêu đề",
            "",
            ValueType.String,
            "Dùng để cấu hình tiêu đề của trang, sẽ hiển thị trong menu và tab. Thường dùng kèm với quốc tế hóa.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "icon",
            "Biểu tượng",
            "",
            ValueType.String,
            "Dùng để cấu hình biểu tượng của trang, sẽ hiển thị trong menu và tab. Thường dùng kèm với thư viện biểu tượng, nếu là liên kết http sẽ tự động tải hình ảnh.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "activeIcon",
            "Biểu tượng đang kích hoạt",
            "",
            ValueType.String,
            "Dùng để cấu hình biểu tượng đang kích hoạt của trang, sẽ hiển thị trong menu. Thường dùng kèm với thư viện biểu tượng, nếu là liên kết http sẽ tự động tải hình ảnh.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "keepAlive",
            "Có bật bộ nhớ đệm không",
            "true",
            ValueType.Boolean,
            "Dùng để cấu hình trang có bật bộ nhớ đệm không, sau khi bật trang sẽ được lưu đệm, không tải lại, chỉ có hiệu lực khi tab được bật.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "hideInMenu",
            "Có ẩn trong menu không",
            "false",
            ValueType.Boolean,
            "Dùng để cấu hình trang có ẩn trong menu không, sau khi ẩn trang sẽ không hiển thị trong menu.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "hideInTab",
            "Có ẩn trong tab không",
            "false",
            ValueType.Boolean,
            "Dùng để cấu hình trang có ẩn trong tab không, sau khi ẩn trang sẽ không hiển thị trong tab.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "hideInBreadcrumb",
            "Có ẩn trong breadcrumb không",
            "false",
            ValueType.Boolean,
            "Dùng để cấu hình trang có ẩn trong breadcrumb không, sau khi ẩn trang sẽ không hiển thị trong breadcrumb.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "hideChildrenInMenu",
            "Có ẩn menu con không",
            "false",
            ValueType.Boolean,
            "Dùng để cấu hình các trang con của trang có ẩn trong menu không, sau khi ẩn các trang con sẽ không hiển thị trong menu.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "authority",
            "Quyền trang",
            "",
            ValueType.Array,
            "Dùng để cấu hình quyền của trang, chỉ người dùng có quyền tương ứng mới được truy cập trang, không cấu hình thì không cần quyền.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "badge",
            "Huy hiệu trang",
            "",
            ValueType.String,
            "Dùng để cấu hình huy hiệu của trang, sẽ hiển thị trong menu.",
            isStatic: true);
        data.AddItem(
           GuidGenerator,
           "badgeType",
           "Loại huy hiệu",
           "normal",
           ValueType.String,
           "Dùng để cấu hình loại huy hiệu của trang, dot là chấm đỏ nhỏ, normal là văn bản.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "badgeVariants",
            "Màu huy hiệu",
            "success",
            ValueType.String,
            "Dùng để cấu hình màu huy hiệu của trang,'default' | 'destructive' | 'primary' | 'success' | 'warning' | string",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "activePath",
            "Menu đang kích hoạt hiện tại",
            "",
            ValueType.String,
            "Dùng để cấu hình menu đang kích hoạt hiện tại, đôi khi trang không hiển thị trong menu, cần dùng khi kích hoạt menu cha.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "affixTab",
            "Có ghim tab không",
            "false",
            ValueType.Boolean,
            "Dùng để cấu hình trang có ghim tab không, sau khi ghim tab sẽ không thể đóng.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "affixTabOrder",
            "Thứ tự ghim tab,",
            "0",
            ValueType.Numeic,
            "Dùng để cấu hình thứ tự ghim tab của trang, sắp xếp tăng dần.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "iframeSrc",
            "Địa chỉ trang nhúng",
            "",
            ValueType.String,
            "Dùng để cấu hình địa chỉ iframe của trang nhúng, sau khi đặt sẽ nhúng trang tương ứng trong trang hiện tại.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "ignoreAccess",
            "Có bỏ qua quyền không",
            "false",
            ValueType.Boolean,
            "Dùng để cấu hình trang có bỏ qua quyền không, có thể truy cập trực tiếp.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "link",
            "Đường dẫn chuyển hướng liên kết ngoài",
            "",
            ValueType.String,
            "Dùng để cấu hình đường dẫn chuyển hướng liên kết ngoài, sẽ mở trong cửa sổ mới.",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "maxNumOfOpenTab",
            "Số lượng tab mở tối đa",
            "-1",
            ValueType.Numeic,
            "Dùng để cấu hình số lượng tab mở tối đa, sau khi đặt khi mở tab mới sẽ tự động đóng tab mở sớm nhất (chỉ có hiệu lực khi mở tab cùng tên).",
            isStatic: true);
        data.AddItem(
            GuidGenerator,
            "menuVisibleWithForbidden",
            "Có hiển thị menu khi không có quyền không",
            "false",
            ValueType.Boolean,
            "Dùng để cấu hình trang có thể thấy trong menu nhưng khi truy cập sẽ bị chuyển hướng tới 403.");
        data.AddItem(
            GuidGenerator,
            "openInNewWindow",
            "Có mở trong trang mới không",
            "false",
            ValueType.Boolean,
            "Khi đặt thành true, sẽ mở trang trong cửa sổ mới.");
        data.AddItem(
            GuidGenerator,
            "order",
            "Thứ tự trang",
            "0",
            ValueType.Numeic,
            "Dùng để cấu hình thứ tự của trang, dùng cho thứ tự từ định tuyến tới menu. Lưu ý: thứ tự chỉ có hiệu lực với menu cấp một, thứ tự của menu cấp hai cần đặt theo thứ tự mã trong menu cấp một tương ứng.");
        data.AddItem(
            GuidGenerator,
            "noBasicLayout",
            "Có không dùng bố cục cơ bản không",
            "false",
            ValueType.Boolean,
            "Dùng để cấu hình định tuyến hiện tại không dùng bố cục cơ bản, chỉ có hiệu lực ở cấp cao nhất. Theo mặc định, tất cả các định tuyến đều được bọc trong bố cục cơ bản (bao gồm các thành phần điều hướng như phần đầu và thanh bên), nếu trang của bạn không cần các thành phần này, có thể đặt noBasicLayout thành true.");

        await DataDictionaryDataSeeder.SeedAsync(data);

        return data;
    }

    private int GetNextCode()
    {
        Interlocked.Increment(ref _lastCodeNumber);
        return _lastCodeNumber;
    }
}
