<%--
  ADOBE CONFIDENTIAL
  __________________

   Copyright 2013 Adobe Systems Incorporated
   All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%
%><%@page session="false"
          import="com.day.cq.wcm.api.WCMMode,
                  java.util.List,
                  com.day.cq.wcm.api.components.IncludeOptions,
                  com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><c:set var="wcmMode"><%= WCMMode.fromRequest(request) != WCMMode.DISABLED %></c:set><%
%>
<c:if test="${wcmMode}">
    <%

        // Find all angular components
        Page angularPage = resource.adaptTo(Page.class);
        slingRequest.setAttribute("angularPage", angularPage);

        List<Resource> angularPageComponents = FrameworkContentExporterUtils.getAllAngularPageComponents(angularPage.getContentResource());

        String relativeResourcePath = FrameworkContentExporterUtils.getRelativePathToDescendantResource(
                currentPage.adaptTo(Resource.class), angularPage.adaptTo(Resource.class));
        pageContext.setAttribute("relativeResourcePath", relativeResourcePath);

        slingResponse.setContentType("application/javascript");

    %><c:set var="controllerNameStripped"><%= angularPage.getPath().replaceAll("[^A-Za-z0-9]", "") %></c:set>

        // Controller for page '<c:out value="${angularPage.name}"/>'
        .controller('<c:out value="${controllerNameStripped}"/>', ['$scope', '$http',
            function($scope, $http) {
                var data = $http.get('<c:out value="${relativeResourcePath}"/>.angular.json' + cacheKiller);
    <%

        for (Resource angularComponent : angularPageComponents) {
            IncludeOptions opts = IncludeOptions.getOptions(request, true);
            opts.setDecorationTagName("");
            opts.forceSameContext(Boolean.TRUE);
    %><cq:include resourceType="<%= angularComponent.getResourceType() %>" path="<%= angularComponent.getPath() + ".controller.js" %>"/><%
            }
    %>
        }])
</c:if>