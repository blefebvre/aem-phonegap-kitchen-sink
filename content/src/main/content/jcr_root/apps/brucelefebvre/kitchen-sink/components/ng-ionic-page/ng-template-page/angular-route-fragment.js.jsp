<%--
  angular-route-fragment.js files _must_ render JS in this form:

      .when('/<path>', {
          templateUrl: '<path to template>',
          controller: '<controller name>'
      })
--%><%
%><%@page session="false"
          import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    String relativeResourcePath = FrameworkContentExporterUtils.getRelativePathToDescendantResource(
            currentPage.adaptTo(Resource.class), resource);
    pageContext.setAttribute("relativeResourcePath", relativeResourcePath);

    slingResponse.setContentType("application/javascript");
%><%
%><c:set var="controllerNameStripped"><%= resource.getPath().replaceAll("[^A-Za-z0-9]", "") %></c:set>
                .when('<c:out value="${resource.path}"/>/:id', {
                    templateUrl: '<c:out value="${relativeResourcePath}"/>.template.html',
                    controller: '<c:out value="${controllerNameStripped}"/>'
                })
