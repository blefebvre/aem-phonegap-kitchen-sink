<%@page session="false" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%>
    <div class="bar bar-header bar-positive">
        <a ng-click="back()" class="button icon-left ion-chevron-left button-clear"></a>
    </div>
    
    <div class="page-content content has-header">
        <cq:include path="ng-library-item" resourceType="brucelefebvre/kitchen-sink/components/ng-library-item" />
    </div>