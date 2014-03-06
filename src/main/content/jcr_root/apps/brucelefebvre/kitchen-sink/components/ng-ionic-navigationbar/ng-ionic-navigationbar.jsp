<%@page session="false"
          import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils" %><%
%><%@include file="/libs/foundation/global.jsp" %><%

    String headerText = currentPage.getTitle();
    String headerImage = currentPage.getProperties().get("headerImage", "");
    boolean useImage = (headerImage != null && headerImage.length() > 0);

    boolean isTopLevelAppPage = FrameworkContentExporterUtils.isTopLevelAppResource(currentPage.adaptTo(Resource.class));

%><c:set var="useImage"><%= useImage %></c:set><%
%><c:set var="isTopLevelAppPage"><%= isTopLevelAppPage %></c:set><%
%>

<div class="bar bar-header bar-positive">
    <c:choose>
        <c:when test="${isTopLevelAppPage}">
            <%-- TODO: impl menu --%>
        </c:when>
        <c:otherwise>
    		<a ng-click="back()" class="button icon-left ion-chevron-left button-clear"></a>
        </c:otherwise>
    </c:choose>
    <h1 class="title"><%= xssAPI.encodeForHTML(headerText) %></h1>
</div>
