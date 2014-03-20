<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false" %><%
%>
<div ng-controller="CameraCtrl" class="list card">
    <div class="item">
        <h2><%= xssAPI.encodeForHTML(properties.get("title", "Camera")) %></h2>
        <p><%= xssAPI.encodeForHTML(properties.get("subtitle", "Take a picture")) %></p>
    </div>
    
    <div class="item item-image">
        <img ng-src="{{imageSrc}}">
    </div>
    
    <div class="item tabs tabs-secondary tabs-icon-left">
        <a class="tab-item" ng-click="takeAPicture()">
            <i class="icon ion-ios7-camera-outline"></i>
            <%= xssAPI.encodeForHTML(properties.get("useCamera", "")) %>
        </a>
        <a class="tab-item" ng-click="browseForAPicture()">
            <i class="icon ion-ios7-photos-outline"></i>
            <%= xssAPI.encodeForHTML(properties.get("useGallery", "")) %>
        </a>
    </div>
</div>
