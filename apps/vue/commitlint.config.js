const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scopes = fs
  .readdirSync(path.resolve(__dirname, 'src'), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name.replace(/s$/, ''));

// precomputed scope
const scopeComplete = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n')
  .find((r) => ~r.indexOf('M  src'))
  ?.replace(/(\/)/g, '%%')
  ?.match(/src%%((\w|-)*)/)?.[1]
  ?.replace(/s$/, '');

/** @type {import('cz-git').UserConfig} */
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'style',
        'docs',
        'test',
        'refactor',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
  prompt: {
    /** @use `yarn commit :f` */
    alias: {
      f: 'docs: fix typos',
      r: 'docs: update README',
      s: 'style: update code format',
      b: 'build: bump dependencies',
      c: 'chore: update config',
    },
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    defaultScope: scopeComplete,
    scopes: [...scopes, 'mock'],
    allowEmptyIssuePrefixs: false,
    allowCustomIssuePrefixs: false,

    // English
    typesAppend: [
      { value: 'wip', name: 'wip:      work in process' },
      { value: 'workflow', name: 'workflow: workflow improvements' },
      { value: 'types', name: 'types:    type definition file changes' },
    ],

    // Bản đối chiếu Trung - Anh
    // messages: {
    //   type: 'Chọn loại bạn muốn commit :',
    //   scope: 'Chọn một phạm vi commit (tùy chọn):',
    //   customScope: 'Nhập phạm vi commit tùy chỉnh :',
    //   subject: 'Điền mô tả thay đổi ngắn gọn, súc tích :\n',
    //   body: 'Điền mô tả thay đổi chi tiết hơn (tùy chọn). Dùng "|" để xuống dòng :\n',
    //   breaking: 'Liệt kê các thay đổi phá vỡ tương thích (tùy chọn). Dùng "|" để xuống dòng :\n',
    //   footerPrefixsSelect: 'Chọn tiền tố issue liên quan (tùy chọn):',
    //   customFooterPrefixs: 'Nhập tiền tố issue tùy chỉnh :',
    //   footer: 'Liệt kê issue liên quan (tùy chọn) ví dụ: #31, #I3244 :\n',
    //   confirmCommit: 'Có commit hoặc sửa commit không ?',
    // },
    // types: [
    //   { value: 'feat', name: 'feat:     Tính năng mới' },
    //   { value: 'fix', name: 'fix:      Sửa lỗi' },
    //   { value: 'docs', name: 'docs:     Thay đổi tài liệu' },
    //   { value: 'style', name: 'style:    Định dạng code' },
    //   { value: 'refactor', name: 'refactor: Tái cấu trúc code' },
    //   { value: 'perf', name: 'perf:     Tối ưu hiệu năng' },
    //   { value: 'test', name: 'test:     Thêm test còn thiếu hoặc sửa test hiện có' },
    //   { value: 'build', name: 'build:    Thay đổi quy trình build, dependency bên ngoài (ví dụ nâng cấp gói npm, sửa cấu hình đóng gói...)' },
    //   { value: 'ci', name: 'ci:       Sửa cấu hình, script CI' },
    //   { value: 'revert', name: 'revert:   Hoàn tác commit' },
    //   { value: 'chore', name: 'chore:    Thay đổi quy trình build hoặc công cụ/thư viện hỗ trợ (không ảnh hưởng file nguồn, test case)' },
    //   { value: 'wip', name: 'wip:      Đang phát triển' },
    //   { value: 'workflow', name: 'workflow: Cải tiến quy trình làm việc' },
    //   { value: 'types', name: 'types:    Sửa file định nghĩa kiểu' },
    // ],
    // emptyScopesAlias: 'empty:      Không điền',
    // customScopesAlias: 'custom:     Tùy chỉnh',
  },
};
