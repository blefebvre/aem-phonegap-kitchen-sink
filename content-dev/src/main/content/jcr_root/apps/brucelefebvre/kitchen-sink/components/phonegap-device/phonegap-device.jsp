<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false" %><%
%>
<div ng-controller="DeviceCtrl" class="list">
	<label class="item item-input item-stacked-label">
		<span class="input-label">
			Platform
		</span>
		<input type="text" disabled ng-value="device.platform">
	</label>

	<label class="item item-input item-stacked-label">
		<span class="input-label">
			Model
		</span>
		<input type="text" disabled ng-value="device.model">
	</label>

	<label class="item item-input item-stacked-label">
		<span class="input-label">
			OS Version
		</span>
		<input type="text" disabled ng-value="device.version">
	</label>

	<label class="item item-input item-stacked-label">
		<span class="input-label">
			Cordova Version
		</span>
		<input type="text" disabled ng-value="device.cordova">
	</label>
</div>
