<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false" %><%
%>
<div ng-controller="ConnectionCtrl" class="list">
	<label class="item item-input item-stacked-label">
        <span class="input-label">Connection type</span>
		<input type="text" placeholder="Determining..." disabled ng-value="connectionType">
	</label>
</div>
