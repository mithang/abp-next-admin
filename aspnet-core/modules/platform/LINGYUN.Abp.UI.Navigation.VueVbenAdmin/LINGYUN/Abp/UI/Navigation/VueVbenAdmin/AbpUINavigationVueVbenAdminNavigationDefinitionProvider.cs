using System;
using System.Reflection;
using Volo.Abp.Data;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.UI.Navigation.VueVbenAdmin;

public class AbpUINavigationVueVbenAdminNavigationDefinitionProvider : NavigationDefinitionProvider
{
    public override void Define(INavigationDefinitionContext context)
    {
        context.Add(GetDashboard());
        context.Add(GetManage());
        context.Add(GetSaas());
        context.Add(GetPlatform());
        // TODO: Gateway không còn cần quản lý động
        // context.Add(GetApiGateway());
        context.Add(GetLocalization());
        context.Add(GetOssManagement());
        context.Add(GetTaskManagement());
        context.Add(GetWebhooksManagement());
        context.Add(GetMessages());
        context.Add(GetTextTemplating());
    }

    private static NavigationDefinition GetDashboard()
    {
        var dashboard = new ApplicationMenu(
            name: "Vben Dashboard",
            displayName: "Bảng điều khiển",
            url: "/dashboard",
            component: "",
            description: "Bảng điều khiển",
            icon: "ion:grid-outline",
            redirect: "/dashboard/workbench");

        dashboard.AddItem(
            new ApplicationMenu(
                name: "Analysis",
                displayName: "Trang phân tích",
                url: "/dashboard/analysis",
                component: "/dashboard/analysis/index",
                description: "Trang phân tích"));
        dashboard.AddItem(
           new ApplicationMenu(
               name: "Workbench",
               displayName: "Bàn làm việc",
               url: "/dashboard/workbench",
               component: "/dashboard/workbench/index",
               description: "Bàn làm việc"));


        return new NavigationDefinition(dashboard);
    }

    private static NavigationDefinition GetManage()
    {
        var manage = new ApplicationMenu(
            name: "Manage",
            displayName: "Quản lý",
            url: "/manage",
            component: "",
            description: "Quản lý",
            icon: "ant-design:control-outlined");

        var identity = manage.AddItem(
            new ApplicationMenu(
                name: "Identity",
                displayName: "Quản lý xác thực danh tính",
                url: "/manage/identity",
                component: "",
                description: "Quản lý xác thực danh tính"));
        identity.AddItem(
          new ApplicationMenu(
              name: "User",
              displayName: "Người dùng",
              url: "/manage/identity/user",
              component: "/identity/user/index",
              description: "Người dùng"));
        identity.AddItem(
          new ApplicationMenu(
              name: "Role",
              displayName: "Vai trò",
              url: "/manage/identity/role",
              component: "/identity/role/index",
              description: "Vai trò"));
        identity.AddItem(
          new ApplicationMenu(
              name: "Claim",
              displayName: "Định danh",
              url: "/manage/identity/claim-types",
              component: "/identity/claim-types/index",
              description: "Định danh",
              multiTenancySides: MultiTenancySides.Host));
        identity.AddItem(
          new ApplicationMenu(
              name: "OrganizationUnits",
              displayName: "Tổ chức",
              url: "/manage/identity/organization-units",
              component: "/identity/organization-units/index",
              description: "Tổ chức"));
        identity.AddItem(
          new ApplicationMenu(
              name: "SecurityLogs",
              displayName: "Nhật ký bảo mật",
              url: "/manage/identity/security-logs",
              component: "/identity/security-logs/index",
              description: "Nhật ký bảo mật")
            // Route này cần phụ thuộc tính năng nhật ký bảo mật
            .SetProperty("requiredFeatures", "AbpAuditing.Logging.SecurityLog"));

        manage.AddItem(new ApplicationMenu(
               name: "AuditLogs",
               displayName: "Nhật ký kiểm toán",
               url: "/manage/audit-logs",
               component: "/auditing/index",
               description: "Nhật ký kiểm toán")
            // Route này cần phụ thuộc tính năng nhật ký kiểm toán
            .SetProperty("requiredFeatures", "AbpAuditing.Logging.AuditLog"));

        var settingManagement = manage.AddItem(new ApplicationMenu(
               name: "SettingManagement",
               displayName: "Quản lý cài đặt",
               url: "/manage/settings",
               component: "LAYOUT",
               description: "Quản lý cài đặt",
               icon: "ant-design:setting-outlined",
               multiTenancySides: MultiTenancySides.Host)
            // Route này cần phụ thuộc tính năng quản lý cài đặt
            .SetProperty("requiredFeatures", "SettingManagement.Enable"));
        settingManagement.AddItem(new ApplicationMenu(
               name: "SystemSettings",
               displayName: "Cài đặt hệ thống",
               url: "/manage/settings/system-setting",
               component: "/settings-management/settings/index",
               description: "Cài đặt hệ thống",
               multiTenancySides: MultiTenancySides.Host));
        settingManagement.AddItem(new ApplicationMenu(
               name: "SettingDefinitions",
               displayName: "Định nghĩa cài đặt",
               url: "/manage/settings/definitions",
               component: "/settings-management/definitions/index",
               description: "Định nghĩa cài đặt",
               multiTenancySides: MultiTenancySides.Host));

        var featureManagement = manage.AddItem(new ApplicationMenu(
               name: "FeaturesManagement",
               displayName: "Quản lý tính năng",
               url: "/manage/feature-management",
               component: "LAYOUT",
               description: "Quản lý tính năng",
               icon: "ant-design:gold-outlined",
               multiTenancySides: MultiTenancySides.Host));
        featureManagement.AddItem(new ApplicationMenu(
               name: "FeaturesGroupDefinitions",
               displayName: "Nhóm tính năng",
               url: "/manage/feature-management/definitions/groups",
               component: "/feature-management/definitions/groups/index",
               description: "Nhóm tính năng",
               multiTenancySides: MultiTenancySides.Host));
        featureManagement.AddItem(new ApplicationMenu(
               name: "FeaturesDefinitions",
               displayName: "Định nghĩa tính năng",
               url: "/manage/feature-management/definitions/features",
               component: "/feature-management/definitions/features/index",
               description: "Định nghĩa tính năng",
               multiTenancySides: MultiTenancySides.Host));

        var permissionManagement = manage.AddItem(new ApplicationMenu(
              name: "PermissionsManagement",
              displayName: "Quản lý quyền",
              url: "/manage/permission-management",
              component: "LAYOUT",
              description: "Quản lý quyền",
              icon: "arcticons:permissionsmanager",
              multiTenancySides: MultiTenancySides.Host));
        permissionManagement.AddItem(new ApplicationMenu(
               name: "PermissionsGroupDefinitions",
               displayName: "Nhóm quyền",
               url: "/manage/permission-management/definitions/groups",
               component: "/permission-management/definitions/groups/index",
               description: "Nhóm quyền",
               multiTenancySides: MultiTenancySides.Host));
        permissionManagement.AddItem(new ApplicationMenu(
               name: "PermissionsDefinitions",
               displayName: "Định nghĩa quyền",
               url: "/manage/permission-management/definitions/permissions",
               component: "/permission-management/definitions/permissions/index",
               description: "Định nghĩa quyền",
               multiTenancySides: MultiTenancySides.Host));

        var notificationManagement = manage.AddItem(new ApplicationMenu(
              name: "RealtimeNotifications",
              displayName: "Quản lý thông báo",
              url: "/realtime/notifications",
              component: "LAYOUT",
              description: "Quản lý thông báo",
              icon: "ant-design:notification-outlined",
              multiTenancySides: MultiTenancySides.Host));
        notificationManagement.AddItem(new ApplicationMenu(
               name: "NotificationsGroupDefinitions",
               displayName: "Nhóm thông báo",
               url: "/realtime/notifications/definitions/groups",
               component: "/realtime/notifications/definitions/groups/index",
               description: "Nhóm thông báo",
               multiTenancySides: MultiTenancySides.Host));
        notificationManagement.AddItem(new ApplicationMenu(
               name: "NotificationsDefinitions",
               displayName: "Định nghĩa thông báo",
               url: "/realtime/notifications/definitions/notifications",
               component: "/realtime/notifications/definitions/notifications/index",
               description: "Định nghĩa thông báo",
               multiTenancySides: MultiTenancySides.Host));

        var identityServer = manage.AddItem(
                new ApplicationMenu(
                    name: "IdentityServer",
                    displayName: "Máy chủ xác thực danh tính",
                    url: "/manage/identity-server",
                    component: "",
                    description: "Máy chủ xác thực danh tính",
                    multiTenancySides: MultiTenancySides.Host));
        identityServer.AddItem(
            new ApplicationMenu(
                name: "Clients",
                displayName: "Máy khách",
                url: "/manage/identity-server/clients",
                component: "/identity-server/clients/index",
                description: "Máy khách",
                multiTenancySides: MultiTenancySides.Host));
        identityServer.AddItem(
            new ApplicationMenu(
                name: "ApiResources",
                displayName: "Tài nguyên Api",
                url: "/manage/identity-server/api-resources",
                component: "/identity-server/api-resources/index",
                description: "Tài nguyên Api",
                multiTenancySides: MultiTenancySides.Host));
        identityServer.AddItem(
            new ApplicationMenu(
                name: "IdentityResources",
                displayName: "Tài nguyên danh tính",
                url: "/manage/identity-server/identity-resources",
                component: "/identity-server/identity-resources/index",
                description: "Tài nguyên danh tính",
                multiTenancySides: MultiTenancySides.Host));
        identityServer.AddItem(
            new ApplicationMenu(
                name: "ApiScopes",
                displayName: "Phạm vi Api",
                url: "/manage/identity-server/api-scopes",
                component: "/identity-server/api-scopes/index",
                description: "Phạm vi Api",
                multiTenancySides: MultiTenancySides.Host));
        identityServer.AddItem(
            new ApplicationMenu(
                name: "PersistedGrants",
                displayName: "Ủy quyền bền vững",
                url: "/manage/identity-server/persisted-grants",
                component: "/identity-server/persisted-grants/index",
                description: "Ủy quyền bền vững",
                multiTenancySides: MultiTenancySides.Host));

        var openIddict = manage.AddItem(
                new ApplicationMenu(
                    name: "OpenIddict",
                    displayName: "Máy chủ xác thực danh tính",
                    url: "/manage/openiddict",
                    component: "LAYOUT",
                    description: "Máy chủ xác thực danh tính(OpenIddict)",
                    multiTenancySides: MultiTenancySides.Host));
        openIddict.AddItem(
            new ApplicationMenu(
                name: "OpenIddictApplications",
                displayName: "Quản lý ứng dụng",
                url: "/manage/openiddict/applications",
                component: "/openiddict/applications/index",
                description: "Quản lý ứng dụng",
                multiTenancySides: MultiTenancySides.Host));
        openIddict.AddItem(
            new ApplicationMenu(
                name: "OpenIddictAuthorizations",
                displayName: "Quản lý ủy quyền",
                url: "/manage/openiddict/authorizations",
                component: "/openiddict/authorizations/index",
                description: "Quản lý ủy quyền",
                multiTenancySides: MultiTenancySides.Host));
        openIddict.AddItem(
            new ApplicationMenu(
                name: "OpenIddictScopes",
                displayName: "Phạm vi Api",
                url: "/manage/openiddict/scopes",
                component: "/openiddict/scopes/index",
                description: "Phạm vi Api",
                multiTenancySides: MultiTenancySides.Host));
        openIddict.AddItem(
            new ApplicationMenu(
                name: "OpenIddictTokens",
                displayName: "Token ủy quyền",
                url: "/manage/openiddict/tokens",
                component: "/openiddict/tokens/index",
                description: "Token ủy quyền",
                multiTenancySides: MultiTenancySides.Host));

        manage.AddItem(
            new ApplicationMenu(
                name: "Logs",
                displayName: "Nhật ký hệ thống",
                url: "/sys/logs",
                component: "/sys/logging/index",
                description: "Nhật ký hệ thống",
                multiTenancySides: MultiTenancySides.Host));

        manage.AddItem(
            new ApplicationMenu(
                name: "ApiDocument",
                displayName: "Tài liệu Api",
                url: "/openapi",
                component: "IFrame",
                description: "Tài liệu Api",
                multiTenancySides: MultiTenancySides.Host)
            // TODO: Lưu ý sửa địa chỉ iframe của menu này thủ công sau khi triển khai xong
            .SetProperty("frameSrc", "http://127.0.0.1:30000/swagger/index.html"));

        manage.AddItem(
            new ApplicationMenu(
                name: "Caches",
                displayName: "Quản lý bộ nhớ đệm",
                url: "/manage/cache",
                component: "/caching-management/cache/index",
                description: "Quản lý bộ nhớ đệm"));

        return new NavigationDefinition(manage);
    }

    private static NavigationDefinition GetSaas()
    {
        var saas = new ApplicationMenu(
            name: "Saas",
            displayName: "Saas",
            url: "/saas",
            component: "",
            description: "Saas",
            icon: "ant-design:cloud-server-outlined",
            multiTenancySides: MultiTenancySides.Host);
        saas.AddItem(
          new ApplicationMenu(
              name: "Tenants",
              displayName: "Quản lý tenant",
              url: "/saas/tenants",
              component: "/saas/tenant/index",
              description: "Quản lý tenant",
              multiTenancySides: MultiTenancySides.Host));
        saas.AddItem(
          new ApplicationMenu(
              name: "Editions",
              displayName: "Quản lý phiên bản",
              url: "/saas/editions",
              component: "/saas/editions/index",
              description: "Quản lý phiên bản",
              multiTenancySides: MultiTenancySides.Host));

        return new NavigationDefinition(saas);
    }

    private static NavigationDefinition GetPlatform()
    {
        var platform = new ApplicationMenu(
            name: "Platform",
            displayName: "Quản lý nền tảng",
            url: "/platform",
            component: "",
            description: "Quản lý nền tảng",
            icon: "ep:platform");
        platform.AddItem(
          new ApplicationMenu(
              name: "DataDictionary",
              displayName: "Từ điển dữ liệu",
              url: "/platform/data-dic",
              component: "/platform/dataDic/index",
              description: "Từ điển dữ liệu"));
        platform.AddItem(
          new ApplicationMenu(
              name: "Layout",
              displayName: "Bố cục",
              url: "/platform/layout",
              component: "/platform/layout/index",
              description: "Bố cục"));
        platform.AddItem(
          new ApplicationMenu(
              name: "Menu",
              displayName: "Menu",
              url: "/platform/menu",
              component: "/platform/menu/index",
              description: "Menu"));

        return new NavigationDefinition(platform);
    }

    private static NavigationDefinition GetApiGateway()
    {
        var apiGateway = new ApplicationMenu(
            name: "ApiGateway",
            displayName: "Quản lý gateway",
            url: "/api-gateway",
            component: "",
            description: "Quản lý gateway",
            icon: "ant-design:gateway-outlined",
            multiTenancySides: MultiTenancySides.Host);
        apiGateway.AddItem(
          new ApplicationMenu(
              name: "RouteGroup",
              displayName: "Nhóm route",
              url: "/api-gateway/group",
              component: "/api-gateway/group/index",
              description: "Nhóm route",
              multiTenancySides: MultiTenancySides.Host));
        apiGateway.AddItem(
          new ApplicationMenu(
              name: "GlobalConfiguration",
              displayName: "Cấu hình chung",
              url: "/api-gateway/global",
              component: "/api-gateway/global/index",
              description: "Cấu hình chung",
              multiTenancySides: MultiTenancySides.Host));
        apiGateway.AddItem(
          new ApplicationMenu(
              name: "Route",
              displayName: "Quản lý route",
              url: "/api-gateway/route",
              component: "/api-gateway/route/index",
              description: "Quản lý route",
              multiTenancySides: MultiTenancySides.Host));
        apiGateway.AddItem(
         new ApplicationMenu(
             name: "AggregateRoute",
             displayName: "Route tổng hợp",
             url: "/api-gateway/aggregate",
             component: "/api-gateway/aggregate/index",
             description: "Route tổng hợp",
             multiTenancySides: MultiTenancySides.Host));

        return new NavigationDefinition(apiGateway);
    }

    private static NavigationDefinition GetLocalization()
    {
        var localization = new ApplicationMenu(
            name: "Localization",
            displayName: "Quản lý bản địa hóa",
            url: "/localization",
            component: "",
            description: "Quản lý bản địa hóa",
            icon: "ant-design:translation-outlined",
            multiTenancySides: MultiTenancySides.Host);
        localization.AddItem(
          new ApplicationMenu(
              name: "Languages",
              displayName: "Quản lý ngôn ngữ",
              url: "/localization/languages",
              component: "/localization/languages/index",
              description: "Quản lý ngôn ngữ",
              multiTenancySides: MultiTenancySides.Host)
            );
        localization.AddItem(
          new ApplicationMenu(
              name: "Resources",
              displayName: "Quản lý tài nguyên",
              url: "/localization/resources",
              component: "/localization/resources/index",
              description: "Quản lý tài nguyên",
              multiTenancySides: MultiTenancySides.Host)
            );
        localization.AddItem(
          new ApplicationMenu(
              name: "Texts",
              displayName: "Quản lý tài liệu",
              url: "/localization/texts",
              component: "/localization/texts/index",
              description: "Quản lý tài liệu",
              multiTenancySides: MultiTenancySides.Host)
            );

        return new NavigationDefinition(localization);
    }

    private static NavigationDefinition GetOssManagement()
    {
        var oss = new ApplicationMenu(
            name: "OssManagement",
            displayName: "Lưu trữ đối tượng",
            url: "/oss",
            component: "",
            description: "Lưu trữ đối tượng",
            icon: "ant-design:file-twotone");
        oss.AddItem(
          new ApplicationMenu(
              name: "Containers",
              displayName: "Quản lý container",
              url: "/oss/containers",
              component: "/oss-management/containers/index",
              description: "Quản lý container"));
        oss.AddItem(
          new ApplicationMenu(
              name: "Objects",
              displayName: "Quản lý tệp",
              url: "/oss/objects",
              component: "/oss-management/objects/index",
              description: "Quản lý tệp"));

        return new NavigationDefinition(oss);
    }

    private static NavigationDefinition GetTaskManagement()
    {
        var task = new ApplicationMenu(
            name: "TaskManagement",
            displayName: "Nền tảng lập lịch tác vụ",
            url: "/task-management",
            component: "",
            description: "Nền tảng lập lịch tác vụ",
            icon: "bi:list-task");
        task.AddItem(
          new ApplicationMenu(
              name: "BackgroundJobs",
              displayName: "Quản lý tác vụ",
              url: "/task-management/background-jobs",
              component: "/task-management/background-jobs/index",
              description: "Quản lý tác vụ"));
        task.AddItem(
          new ApplicationMenu(
              name: "BackgroundJobInfoDetail",
              displayName: "Chi tiết tác vụ",
              url: "/task-management/background-jobs/:id",
              component: "/task-management/background-jobs/components/BackgroundJobInfoDetail",
              description: "Chi tiết tác vụ")
          .SetProperty("hideMenu", "true")
          .SetProperty("hideTab", "true"));

        return new NavigationDefinition(task);
    }

    private static NavigationDefinition GetWebhooksManagement()
    {
        var webhooks = new ApplicationMenu(
            name: "WebHooks",
            displayName: "WebHooks",
            url: "/webhooks",
            component: "",
            description: "WebHooks",
            icon: "ic:outline-webhook",
            multiTenancySides: MultiTenancySides.Host);
        webhooks.AddItem(
          new ApplicationMenu(
              name: "Subscriptions",
              displayName: "Quản lý đăng ký",
              url: "/webhooks/subscriptions",
              component: "/webhooks/subscriptions/index",
              description: "Quản lý đăng ký",
              multiTenancySides: MultiTenancySides.Host));
        webhooks.AddItem(
          new ApplicationMenu(
              name: "SendAttempts",
              displayName: "Quản lý bản ghi",
              url: "/webhooks/send-attempts",
              component: "/webhooks/send-attempts/index",
              description: "Quản lý bản ghi",
              multiTenancySides: MultiTenancySides.Host));
        webhooks.AddItem(
          new ApplicationMenu(
              name: "WebhooksGroupDefinitions",
              displayName: "Nhóm Webhook",
              url: "/webhooks/definitions/groups",
              component: "/webhooks/definitions/groups/index",
              description: "Nhóm Webhook",
              multiTenancySides: MultiTenancySides.Host));
        webhooks.AddItem(
          new ApplicationMenu(
              name: "WebhooksDefinitions",
              displayName: "Định nghĩa Webhook",
              url: "/webhooks/definitions/webhooks",
              component: "/webhooks/definitions/webhooks/index",
              description: "Định nghĩa Webhook",
              multiTenancySides: MultiTenancySides.Host));

        return new NavigationDefinition(webhooks);
    }

    private static NavigationDefinition GetMessages()
    {
        var messages = new ApplicationMenu(
            name: "Messages",
            displayName: "Quản lý tin nhắn",
            url: "/messages",
            component: "",
            description: "Quản lý tin nhắn",
            icon: "ant-design:message-outlined");
        messages.AddItem(
          new ApplicationMenu(
              name: "Notifications",
              displayName: "Quản lý thông báo",
              url: "/messages/notifications",
              component: "/messages/notifications/index",
              description: "Quản lý thông báo"));

        return new NavigationDefinition(messages);
    }

    private static NavigationDefinition GetTextTemplating()
    {
        var textTemplating = new ApplicationMenu(
            name: "Templates",
            displayName: "Quản lý mẫu",
            url: "/text-templating",
            component: "",
            description: "Quản lý mẫu",
            icon: "eos-icons:templates-outlined",
            multiTenancySides: MultiTenancySides.Host);
        textTemplating.AddItem(
          new ApplicationMenu(
              name: "TextTemplates",
              displayName: "Mẫu văn bản",
              url: "/text-templating/text-templates",
              component: "/text-templating/templates/index",
              description: "Mẫu văn bản",
              multiTenancySides: MultiTenancySides.Host));

        return new NavigationDefinition(textTemplating);
    }
}
