<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false" %><%
%>
<div ng-controller="LocationCtrl" class="list">
	<label class="item item-input item-stacked-label">
		<span class="input-label">Latitude</span>
		<input type="text" placeholder="Locating..." disabled ng-value="latitude">
	</label>
	<label class="item item-input item-stacked-label">
		<span class="input-label">Longitude</span>
		<input type="text" placeholder="Locating..." disabled ng-value="longitude">
	</label>

    <div class="list card">
        <div class="item item-image">
            <img ng-src="{{mapImageSrc}}">
        </div>
    </div>

</div>
