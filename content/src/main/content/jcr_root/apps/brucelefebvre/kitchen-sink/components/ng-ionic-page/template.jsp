<%@page session="false"
        import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    String headerText = currentPage.getTitle();
	boolean isTopLevelAppPage = FrameworkContentExporterUtils.isTopLevelAppResource(currentPage.adaptTo(Resource.class));
%><%
%><c:set var="isTopLevelAppPage"><%= isTopLevelAppPage %></c:set>
    <div class="bar bar-header bar-positive">
        <c:choose>
            <c:when test="${isTopLevelAppPage}">
                <a snap-toggle class="button icon-left ion-navicon-round button-clear"></a>
            </c:when>
            <c:otherwise>
                <a ng-click="back()" class="button icon-left ion-chevron-left button-clear"></a>
            </c:otherwise>
        </c:choose>
        <h1 class="title"><%= xssAPI.encodeForHTML(headerText) %></h1>
    </div>
    
    <div class="page-content content has-header">
        <cq:include path="content-par" resourceType="foundation/components/parsys" />
    </div>