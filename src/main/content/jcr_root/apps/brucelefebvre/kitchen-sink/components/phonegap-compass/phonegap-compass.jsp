<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false" %><%
%>
<div phonegap-compass class="list">
	<label class="item item-input item-stacked-label">
		<span class="input-label">Heading</span>
		<input type="text" placeholder="Locating..." disabled ng-value="heading">
	</label>
	<div style="padding:20px;">
		<cq:include script="compass-svg.jsp" />
	</div>
</div>
