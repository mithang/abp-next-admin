using Volo.Abp.Data;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.UI.Navigation.VueVbenAdmin5;

public class AbpUINavigationVueVbenAdmin5NavigationDefinitionProvider : NavigationDefinitionProvider
{
    public override void Define(INavigationDefinitionContext context)
    {
        context.Add(GetDashboard());
        context.Add(GetAccount());
        context.Add(GetManage());
        context.Add(GetAIManagement());
        context.Add(GetSaas());
        context.Add(GetPlatform());
        context.Add(GetBlobManagement());
        context.Add(GetTaskManagement());
        context.Add(GetWebhooksManagement());
        context.Add(GetTextTemplating());
        context.Add(GetWeChatManagement());
        context.Add(GetVbenDemos());
    }

    private static NavigationDefinition[] GetVbenDemos()
    {
        var project = new ApplicationMenu(
            name: "VbenProject",
            displayName: "Dự án",
            url: "/vben-admin",
            component: "",
            description: "Dự án",
            order: 9998,
            icon: "https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp")
            .SetProperty("badgeType", "dot")
            .SetProperty("title", "demos.vben.title");
        project.AddItem(
            new ApplicationMenu(
                name: "VbenDocument",
                displayName: "Tài liệu",
                url: "/vben-admin/document",
                component: "",
                icon: "lucide:book-open-text",
                description: "Tài liệu")
            .SetProperty("link", "https://doc.vben.pro")
            .SetProperty("title", "demos.vben.document")
         );
        project.AddItem(
            new ApplicationMenu(
                name: "VbenGithub",
                displayName: "Github",
                url: "/vben-admin/github",
                component: "",
                icon: "mdi:github",
                description: "Github")
            .SetProperty("link", "https://github.com/vbenjs/vue-vben-admin")
            .SetProperty("title", "Github")
         );
        project.AddItem(
            new ApplicationMenu(
                name: "VbenNaive",
                displayName: "Phiên bản Naive UI",
                url: "/vben-admin/naive",
                component: "",
                icon: "logos:naiveui",
                description: "Phiên bản Naive UI")
            .SetProperty("badgeType", "dot")
            .SetProperty("link", "https://naive.vben.pro")
            .SetProperty("title", "demos.vben.naive-ui")
         );
        project.AddItem(
            new ApplicationMenu(
                name: "VbenElementPlus",
                displayName: "Phiên bản Element Plus",
                url: "/vben-admin/ele",
                component: "",
                icon: "logos:element",
                description: "Phiên bản Element Plus")
            .SetProperty("badgeType", "dot")
            .SetProperty("link", "https://ele.vben.pro")
            .SetProperty("title", "demos.vben.element-plus")
         );

        var about = new ApplicationMenu(
            name: "VbenAbout",
            displayName: "Giới thiệu",
            url: "/vben-admin/about",
            component: "/_core/about/index",
            description: "Giới thiệu",
            order: 9999,
            icon: "lucide:copyright")
            .SetProperty("title", "demos.vben.about");

        return new NavigationDefinition[2]
        {
            new NavigationDefinition(project),
            new NavigationDefinition(about),
        };
    }

    private static NavigationDefinition GetAccount()
    {
        var account = new ApplicationMenu(
            name: "Vben5Account",
            displayName: "Quản lý tài khoản",
            url: "/account",
            component: "",
            description: "Quản lý tài khoản",
            icon: "mdi:account-outline")
            .WithRoles(["Users"])
            .SetProperty("hideInMenu", "true")
            .SetProperty("title", "abp.account.title");

        account.AddItem(
            new ApplicationMenu(
                name: "Vben5AccountMySettings",
                displayName: "Cài đặt cá nhân",
                url: "/account/my-settings",
                component: "/account/my-settings/index",
                icon: "tdesign:user-setting",
                description: "Cài đặt cá nhân")
            .WithRoles(["Users"])
            .SetProperty("hideInMenu", "true")
            .SetProperty("title", "abp.account.settings.title")
         );

        return new NavigationDefinition(account);
    }

    private static NavigationDefinition GetDashboard()
    {
        var dashboard = new ApplicationMenu(
            name: "Vben5Dashboard",
            displayName: "Bảng điều khiển",
            url: "/dashboard",
            component: "",
            description: "Bảng điều khiển",
            icon: "lucide:layout-dashboard",
            order: -1)
            .WithRoles(["Users"])
            .SetProperty("title", "page.dashboard.title");

        dashboard.AddItem(
            new ApplicationMenu(
                name: "Vben5Analysis",
                displayName: "Trang phân tích",
                url: "/analytics",
                component: "/dashboard/analytics/index",
                icon: "lucide:area-chart",
                description: "Trang phân tích")
            .SetProperty("affixTab", "true")
            .SetProperty("title", "page.dashboard.analytics")
         );

        dashboard.AddItem(
           new ApplicationMenu(
               name: "Vben5Workbench",
               displayName: "Bàn làm việc",
               url: "/workspace",
               component: "/dashboard/workspace/index",
               icon: "carbon:workspace",
               description: "Bàn làm việc")
           .WithRoles(["Users"])
           .SetProperty("title", "page.dashboard.workspace")
        );

        return new NavigationDefinition(dashboard);
    }

    private static NavigationDefinition GetManage()
    {
        var manage = new ApplicationMenu(
            name: "Vben5Manage",
            displayName: "Quản lý",
            url: "/manage",
            component: "",
            description: "Quản lý",
            icon: "arcticons:activity-manager")
            .SetProperty("title", "abp.manage.title");

        var openIddict = manage.AddItem(
                new ApplicationMenu(
                    name: "Vben5OpenIddict",
                    displayName: "Máy chủ xác thực danh tính",
                    url: "/manage/openiddict",
                    component: "",
                    icon: "mdi:openid",
                    description: "Máy chủ xác thực danh tính (OpenIddict)",
                    multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.openiddict.title"));
        openIddict.AddItem(
            new ApplicationMenu(
                name: "Vben5OpenIddictApplications",
                displayName: "Quản lý ứng dụng",
                url: "/manage/openiddict/applications",
                component: "/openiddict/applications/index",
                icon: "carbon:application",
                description: "Quản lý ứng dụng",
                multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.openiddict.applications"));
        openIddict.AddItem(
            new ApplicationMenu(
                name: "Vben5OpenIddictAuthorizations",
                displayName: "Quản lý ủy quyền",
                url: "/manage/openiddict/authorizations",
                component: "/openiddict/authorizations/index",
                icon: "arcticons:ente-authenticator",
                description: "Quản lý ủy quyền",
                multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.openiddict.authorizations"));
        openIddict.AddItem(
            new ApplicationMenu(
                name: "Vben5OpenIddictScopes",
                displayName: "Quản lý phạm vi",
                url: "/manage/openiddict/scopes",
                component: "/openiddict/scopes/index",
                icon: "et:scope",
                description: "Quản lý phạm vi",
                multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.openiddict.scopes"));
        openIddict.AddItem(
            new ApplicationMenu(
                name: "Vben5OpenIddictTokens",
                displayName: "Token ủy quyền",
                url: "/manage/openiddict/tokens",
                component: "/openiddict/tokens/index",
                icon: "oui:token-key",
                description: "Token ủy quyền",
                multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.openiddict.tokens"));

        var identity = manage.AddItem(
            new ApplicationMenu(
                name: "Vben5Identity",
                displayName: "Quản lý xác thực danh tính",
                url: "/manage/identity",
                component: "",
                icon: "teenyicons:id-outline",
                description: "Quản lý xác thực danh tính")
            .SetProperty("title", "abp.manage.identity.title"));
        identity.AddItem(
          new ApplicationMenu(
              name: "Vben5IdentityUsers",
              displayName: "Quản lý người dùng",
              url: "/manage/identity/users",
              component: "/identity/users/index",
              icon: "mdi:user-outline",
              description: "Quản lý người dùng")
          .SetProperty("title", "abp.manage.identity.user"));
        identity.AddItem(
          new ApplicationMenu(
              name: "Vben5IdentityRoles",
              displayName: "Quản lý vai trò",
              url: "/manage/identity/roles",
              component: "/identity/roles/index",
              icon: "carbon:user-role",
              description: "Quản lý vai trò")
          .SetProperty("title", "abp.manage.identity.role"));
        identity.AddItem(
          new ApplicationMenu(
              name: "Vben5IdentityClaimTypes",
              displayName: "Định danh",
              url: "/manage/identity/claim-types",
              component: "/identity/claim-types/index",
              icon: "la:id-card-solid",
              description: "Định danh",
              multiTenancySides: MultiTenancySides.Host)
          .SetProperty("title", "abp.manage.identity.claimTypes"));
        identity.AddItem(
          new ApplicationMenu(
              name: "Vben5IdentityOrganizationUnits",
              displayName: "Tổ chức",
              url: "/manage/identity/organization-units",
              component: "/identity/organization-units/index",
              icon: "clarity:organization-line",
              description: "Tổ chức")
          .SetProperty("title", "abp.manage.identity.organizationUnits"));
        identity.AddItem(
          new ApplicationMenu(
              name: "SecurityLogs",
              displayName: "Nhật ký bảo mật",
              url: "/manage/identity/security-logs",
              component: "/identity/security-logs/index",
              icon: "carbon:security",
              description: "Nhật ký bảo mật")
          .SetProperty("title", "abp.manage.identity.securityLogs")
          .SetProperty("requiredFeatures", "AbpAuditing.Logging.SecurityLog"));
        identity.AddItem(
          new ApplicationMenu(
              name: "Vben5IdentitySessions",
              displayName: "Quản lý phiên",
              url: "/manage/identity/sessions",
              component: "/identity/sessions/index",
              icon: "carbon:prompt-session",
              description: "Quản lý phiên")
          .SetProperty("title", "abp.manage.identity.sessions"));

        var permissionManagement = manage.AddItem(new ApplicationMenu(
              name: "Vben5Permissions",
              displayName: "Quản lý quyền",
              url: "/manage/permissions",
              component: "",
              description: "Quản lý quyền",
              icon: "arcticons:permissionsmanager",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.permissions.title"));
        permissionManagement.AddItem(new ApplicationMenu(
               name: "Vben5PermissionsGroupDefinitions",
               displayName: "Nhóm quyền",
               url: "/manage/permissions/groups",
               component: "/permissions/groups/index",
               icon: "lucide:group",
               description: "Nhóm quyền",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.permissions.groups"));
        permissionManagement.AddItem(new ApplicationMenu(
               name: "Vben5PermissionsDefinitions",
               displayName: "Định nghĩa quyền",
               url: "/manage/permissions/definitions",
               component: "/permissions/definitions/index",
               icon: "icon-park-outline:permissions",
               description: "Định nghĩa quyền",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.permissions.definitions"));


        var featureManagement = manage.AddItem(new ApplicationMenu(
               name: "Vben5Features",
               displayName: "Quản lý chức năng",
               url: "/manage/features",
               component: "",
               description: "Quản lý chức năng",
               icon: "ant-design:gold-outlined",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.features.title"));
        featureManagement.AddItem(new ApplicationMenu(
               name: "Vben5FeaturesGroupDefinitions",
               displayName: "Nhóm chức năng",
               url: "/manage/features/groups",
               component: "/features/groups/index",
               icon: "lucide:group",
               description: "Nhóm chức năng",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.features.groups"));
        featureManagement.AddItem(new ApplicationMenu(
               name: "Vben5FeaturesDefinitions",
               displayName: "Định nghĩa chức năng",
               url: "/manage/features/definitions",
               component: "/features/definitions/index",
               icon: "pajamas:feature-flag",
               description: "Định nghĩa chức năng",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.features.definitions"));

        var settingManagement = manage.AddItem(new ApplicationMenu(
               name: "Vben5Settings",
               displayName: "Quản lý cài đặt",
               url: "/manage/settings",
               component: "",
               description: "Quản lý cài đặt",
               icon: "ic:outline-settings")
            .SetProperty("title", "abp.manage.settings.title")
            // Tuyến này cần phụ thuộc vào tính năng quản lý cài đặt
            .SetProperty("requiredFeatures", "SettingManagement.Enable"));
        settingManagement.AddItem(new ApplicationMenu(
               name: "Vben5SettingsSystem",
               displayName: "Cài đặt hệ thống",
               url: "/manage/settings/system",
               component: "/settings/system/index",
               icon: "tabler:settings-cog",
               description: "Cài đặt hệ thống")
            .SetProperty("title", "abp.manage.settings.system")
            // Tuyến này cần phụ thuộc vào tính năng quản lý cài đặt
            .SetProperty("requiredFeatures", "SettingManagement.Enable"));
        settingManagement.AddItem(new ApplicationMenu(
               name: "Vben5SettingsDefinitions",
               displayName: "Định nghĩa cài đặt",
               url: "/manage/settings/definitions",
               component: "/settings/definitions/index",
               icon: "codicon:settings",
               description: "Định nghĩa cài đặt",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.settings.definitions"));

        var localization = manage.AddItem(new ApplicationMenu(
            name: "Vben5Localizations",
            displayName: "Quản lý bản địa hóa",
            url: "/manage/localization",
            component: "",
            description: "Quản lý bản địa hóa",
            icon: "ion:globe-outline",
            multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.localization.title"));
        localization.AddItem(
          new ApplicationMenu(
              name: "Vben5LocalizationsLanguages",
              displayName: "Quản lý ngôn ngữ",
              url: "/manage/localization/languages",
              component: "/localization/languages/index",
              icon: "cil:language",
              description: "Quản lý ngôn ngữ",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.localization.languages")
            );
        localization.AddItem(
          new ApplicationMenu(
              name: "Vben5LocalizationsResources",
              displayName: "Quản lý tài nguyên",
              url: "/manage/localization/resources",
              component: "/localization/resources/index",
              icon: "grommet-icons:resources",
              description: "Quản lý tài nguyên",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.localization.resources")
            );
        localization.AddItem(
          new ApplicationMenu(
              name: "Vben5LocalizationsTexts",
              displayName: "Quản lý tài liệu",
              url: "/manage/localization/texts",
              component: "/localization/texts/index",
              icon: "mi:text",
              description: "Quản lý tài liệu",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.localization.texts")
            );

        var dataProtection = manage.AddItem(new ApplicationMenu(
              name: "Vben5DataProtection",
              displayName: "Bảo vệ dữ liệu",
              url: "/manage/data-protection",
              component: "",
              description: "Bảo vệ dữ liệu",
              icon: "icon-park-outline:protect",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.dataProtection.title"));
        dataProtection.AddItem(new ApplicationMenu(
               name: "Vben5DataProtectionEntityTypeInfos",
               displayName: "Quản lý thực thể",
               url: "/manage/data-protection/entity-type-infos",
               component: "/data-protection/entity-type-infos/index",
               icon: "iconamoon:type",
               description: "Quản lý thực thể",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.dataProtection.entityTypeInfos"));

        manage.AddItem(new ApplicationMenu(
               name: "Vben5AuditingAuditLogs",
               displayName: "Nhật ký kiểm toán",
               url: "/manage/audit-logs",
               component: "/auditing/audit-logs/index",
               icon: "fluent-mdl2:compliance-audit",
               description: "Nhật ký kiểm toán")
            .SetProperty("title", "abp.manage.auditLogs")
            // Tuyến này cần phụ thuộc vào tính năng nhật ký kiểm toán
            .SetProperty("requiredFeatures", "AbpAuditing.Logging.AuditLog"));

        manage.AddItem(
            new ApplicationMenu(
                name: "Vben5AuditingLoggings",
                displayName: "Nhật ký hệ thống",
                url: "/manage/sys-logs",
                component: "/auditing/loggings/index",
                icon: "icon-park-outline:log",
                description: "Nhật ký hệ thống",
                multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.loggings"));

        var notificationManagement = manage.AddItem(new ApplicationMenu(
              name: "Vben5Notifications",
              displayName: "Quản lý thông báo",
              url: "/manage/notifications",
              component: "",
              description: "Quản lý thông báo",
              icon: "tabler:notification")
            .SetProperty("title", "abp.manage.notifications.title"));
        notificationManagement.AddItem(new ApplicationMenu(
               name: "Vben5NotificationsMyNotifilers",
               displayName: "Thông báo của tôi",
               url: "/manage/notifications/my-notifilers",
               component: "/notifications/my-notifilers/index",
               icon: "ant-design:notification-outlined",
               description: "Thông báo của tôi")
            .SetProperty("title", "abp.manage.notifications.myNotifilers"));
        notificationManagement.AddItem(new ApplicationMenu(
               name: "Vben5NotificationsGroupDefinitions",
               displayName: "Nhóm thông báo",
               url: "/manage/notifications/groups",
               component: "/notifications/groups/index",
               icon: "lucide:group",
               description: "Nhóm thông báo",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.notifications.groups"));
        notificationManagement.AddItem(new ApplicationMenu(
               name: "Vben5NotificationsDefinitions",
               displayName: "Định nghĩa thông báo",
               url: "/manage/notifications/definitions",
               component: "/notifications/definitions/index",
               icon: "nimbus:notification",
               description: "Định nghĩa thông báo",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.notifications.definitions"));
        notificationManagement.AddItem(new ApplicationMenu(
               name: "Vben5NotificationsSendRecords",
               displayName: "Lịch sử gửi",
               url: "/manage/notifications/send-records",
               component: "/notifications/send-records/index",
               icon: "material-symbols:history",
               description: "Lịch sử gửi",
               multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.notifications.sendRecords"));

        manage.AddItem(
            new ApplicationMenu(
                name: "Vben5ApiDocument",
                displayName: "Tài liệu Api",
                url: "/manage/openapi",
                component: "IFrame",
                icon: "material-icon-theme:swagger",
                description: "Tài liệu Api",
                multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.manage.openApi")
            // TODO: Lưu ý sau khi triển khai xong hãy sửa thủ công địa chỉ iframe của menu này
            .SetProperty("iframeSrc", "http://127.0.0.1:30000/swagger/index.html"));

        manage.AddItem(
            new ApplicationMenu(
                name: "Vben5Caches",
                displayName: "Quản lý bộ nhớ đệm",
                url: "/manage/cache",
                component: "/caching/caches/index",
                icon: "devicon:redis",
                description: "Quản lý bộ nhớ đệm")
            .SetProperty("title", "abp.manage.cache"));

        return new NavigationDefinition(manage);
    }

    private static NavigationDefinition GetAIManagement()
    {
        var aiManagement = new ApplicationMenu(
            name: "Vben5ArtificialIntelligence",
            displayName: "Trí tuệ nhân tạo",
            url: "/artificia-intelligence",
            component: "",
            description: "Trí tuệ nhân tạo",
            icon: "hugeicons:artificial-intelligence-04")
            .SetProperty("title", "abp.ai.title");
        aiManagement.AddItem(
          new ApplicationMenu(
              name: "Vben5AIToolDefinitions",
              displayName: "Quản lý công cụ",
              url: "/artificia-intelligence/tools",
              component: "/ai-management/tools/index",
              icon: "ant-design:tool-outlined",
              description: "Quản lý công cụ")
            .SetProperty("title", "abp.ai.tools"));
        aiManagement.AddItem(
          new ApplicationMenu(
              name: "Vben5AIWorkspaceDefinitions",
              displayName: "Quản lý không gian làm việc",
              url: "/artificia-intelligence/workspace",
              component: "/ai-management/workspaces/index",
              icon: "carbon:workspace",
              description: "Quản lý không gian làm việc")
            .SetProperty("title", "abp.ai.workspaces"));
        aiManagement.AddItem(
          new ApplicationMenu(
              name: "Vben5AIConversations",
              displayName: "Quản lý phiên",
              url: "/artificia-intelligence/conversations",
              component: "/ai-management/conversations/index",
              icon: "arcticons:conversations",
              description: "Quản lý phiên")
            .SetProperty("title", "abp.ai.conversations"));

        return new NavigationDefinition(aiManagement);
    }

    private static NavigationDefinition GetSaas()
    {
        var saas = new ApplicationMenu(
            name: "Vben5Saas",
            displayName: "Saas",
            url: "/saas",
            component: "",
            description: "Saas",
            icon: "ant-design:cloud-server-outlined",
            multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.saas.title");
        saas.AddItem(
          new ApplicationMenu(
              name: "Vben5SaasTenants",
              displayName: "Quản lý tenant",
              url: "/saas/tenants",
              component: "/saas/tenants/index",
              icon: "arcticons:tenantcloud-pro",
              description: "Quản lý tenant",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.saas.tenants"));
        saas.AddItem(
          new ApplicationMenu(
              name: "Vben5SaasEditions",
              displayName: "Quản lý phiên bản",
              url: "/saas/editions",
              component: "/saas/editions/index",
              icon: "icon-park-outline:multi-rectangle",
              description: "Quản lý phiên bản",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.saas.editions"));

        return new NavigationDefinition(saas);
    }

    private static NavigationDefinition GetPlatform()
    {
        var platform = new ApplicationMenu(
            name: "Vben5Platform",
            displayName: "Quản lý nền tảng",
            url: "/platform",
            component: "",
            description: "Quản lý nền tảng",
            icon: "ep:platform")
            .SetProperty("title", "abp.platform.title");
        platform.AddItem(
          new ApplicationMenu(
              name: "Vben5PlatformDataDictionaries",
              displayName: "Từ điển dữ liệu",
              url: "/platform/data-dictionaries",
              component: "/platform/data-dictionaries/index",
              icon: "material-symbols:dictionary-outline",
              description: "Từ điển dữ liệu")
            .SetProperty("title", "abp.platform.dataDictionaries"));
        platform.AddItem(
          new ApplicationMenu(
              name: "Vben5PlatformLayouts",
              displayName: "Quản lý bố cục",
              url: "/platform/layouts",
              component: "/platform/layouts/index",
              icon: "material-symbols-light:responsive-layout",
              description: "Quản lý bố cục")
            .SetProperty("title", "abp.platform.layouts"));
        platform.AddItem(
          new ApplicationMenu(
              name: "Vben5PlatformMenus",
              displayName: "Quản lý menu",
              url: "/platform/menus",
              component: "/platform/menus/index",
              icon: "material-symbols-light:menu",
              description: "Quản lý menu")
            .SetProperty("title", "abp.platform.menus"));

        var messages = platform.AddItem(
          new ApplicationMenu(
              name: "Vben5PlatformMessages",
              displayName: "Quản lý tin nhắn",
              url: "/platform/messages",
              component: "",
              icon: "tabler:message-cog",
              description: "Quản lý tin nhắn",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.platform.messages.title"));
        messages.AddItem(
          new ApplicationMenu(
              name: "Vben5PlatformEmailMessages",
              displayName: "Tin nhắn email",
              url: "/platform/messages/email",
              component: "/platform/messages/email/index",
              icon: "material-symbols:attach-email-outline",
              description: "Tin nhắn email",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.platform.messages.email"));
        messages.AddItem(
          new ApplicationMenu(
              name: "Vben5PlatformSmsMessages",
              displayName: "Tin nhắn SMS",
              url: "/platform/messages/sms",
              component: "/platform/messages/sms/index",
              icon: "material-symbols:sms-outline",
              description: "Tin nhắn SMS",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.platform.messages.sms"));

        return new NavigationDefinition(platform);
    }

    private static NavigationDefinition GetBlobManagement()
    {
        var oss = new ApplicationMenu(
            name: "Vben5BlobManagement",
            displayName: "Lưu trữ đối tượng",
            url: "/blob-management",
            component: "",
            description: "Lưu trữ đối tượng",
            icon: "icon-park-outline:cloud-storage")
            .SetProperty("title", "abp.oss.title");
        oss.AddItem(
          new ApplicationMenu(
              name: "Vben5BlobContainers",
              displayName: "Quản lý container",
              url: "/blob-management/blob-containers",
              component: "/blob-management/containers/index",
              icon: "mdi:bucket-outline",
              description: "Quản lý container")
            .SetProperty("title", "abp.oss.containers"));
        oss.AddItem(
          new ApplicationMenu(
              name: "Vben5BlobFiles",
              displayName: "Quản lý tệp",
              url: "/blob-management/blobs",
              component: "/blob-management/blobs/index",
              icon: "mdi-light:file",
              description: "Quản lý tệp")
            .SetProperty("title", "abp.oss.objects"));

        return new NavigationDefinition(oss);
    }

    private static NavigationDefinition GetTaskManagement()
    {
        var task = new ApplicationMenu(
            name: "Vben5Tasks",
            displayName: "Quản lý tác vụ",
            url: "/task-management",
            component: "",
            description: "Quản lý tác vụ",
            icon: "eos-icons:background-tasks")
            .SetProperty("title", "abp.tasks.title");
        task.AddItem(
          new ApplicationMenu(
              name: "Vben5TasksJobInfos",
              displayName: "Hàng đợi tác vụ",
              url: "/task-management/background-jobs",
              component: "/tasks/job-infos/index",
              icon: "eos-icons:job",
              description: "Hàng đợi tác vụ")
            .SetProperty("title", "abp.tasks.jobInfo.title"));

        return new NavigationDefinition(task);
    }

    private static NavigationDefinition GetWebhooksManagement()
    {
        var webhooks = new ApplicationMenu(
            name: "Vben5Webhooks",
            displayName: "WebHooks",
            url: "/webhooks",
            component: "",
            description: "WebHooks",
            icon: "material-symbols:webhook",
            multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.webhooks.title");
        webhooks.AddItem(
          new ApplicationMenu(
              name: "Vben5WebhooksGroupDefinitions",
              displayName: "Nhóm Webhook",
              url: "/webhooks/groups",
              component: "/webhooks/groups/index",
              icon: "lucide:group",
              description: "Nhóm Webhook",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.webhooks.groups"));
        webhooks.AddItem(
          new ApplicationMenu(
              name: "Vben5WebhooksDefinitions",
              displayName: "Định nghĩa Webhook",
              url: "/webhooks/definitions",
              component: "/webhooks/definitions/index",
              icon: "material-symbols:webhook",
              description: "Định nghĩa Webhook",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.webhooks.definitions"));
        webhooks.AddItem(
          new ApplicationMenu(
              name: "Vben5WebhooksSubscriptions",
              displayName: "Quản lý đăng ký",
              url: "/webhooks/subscriptions",
              component: "/webhooks/subscriptions/index",
              icon: "material-symbols:subscriptions",
              description: "Quản lý đăng ký",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.webhooks.subscriptions"));
        webhooks.AddItem(
          new ApplicationMenu(
              name: "Vben5WebhooksSendAttempts",
              displayName: "Quản lý bản ghi",
              url: "/webhooks/send-attempts",
              component: "/webhooks/send-attempts/index",
              icon: "material-symbols:history",
              description: "Quản lý bản ghi",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.webhooks.sendAttempts"));

        return new NavigationDefinition(webhooks);
    }

    private static NavigationDefinition GetTextTemplating()
    {
        var textTemplating = new ApplicationMenu(
            name: "Vben5TextTemplating",
            displayName: "Quản lý mẫu",
            url: "/text-templating",
            component: "",
            description: "Quản lý mẫu",
            icon: "tdesign:template",
            multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.textTemplating.title");
        textTemplating.AddItem(
          new ApplicationMenu(
              name: "Vben5TextTemplatingDefinitions",
              displayName: "Định nghĩa mẫu",
              url: "/text-templating/definitions",
              component: "/text-templating/definitions/index",
              icon: "qlementine-icons:template-16",
              description: "Định nghĩa mẫu",
              multiTenancySides: MultiTenancySides.Host)
            .SetProperty("title", "abp.textTemplating.definitions"));

        return new NavigationDefinition(textTemplating);
    }

    private static NavigationDefinition GetWeChatManagement()
    {
        var wechat = new ApplicationMenu(
            name: "Vben5Wechat",
            displayName: "Tích hợp WeChat",
            url: "/wechat",
            component: "",
            description: "Tích hợp WeChat",
            icon: "ant-design:wechat-outlined")
            .SetProperty("title", "abp.wechat.title");
        wechat.AddItem(
          new ApplicationMenu(
              name: "Vben5WechatSettings",
              displayName: "Cài đặt WeChat",
              url: "/wechat/settings",
              component: "/wechat/settings/index",
              icon: "ant-design:setting-outlined",
              description: "Cài đặt WeChat")
            .SetProperty("title", "abp.wechat.settings"));

        return new NavigationDefinition(wechat);
    }
}
