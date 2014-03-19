<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false" %><%
%>
<div ng-controller="CameraCtrl" class="list card">
    <div class="item">
        <h2>Camera</h2>
        <p>Take a picture</p>
    </div>
    
    <div class="item item-image">
        <img ng-src="{{imageSrc}}">
    </div>
    
    <div class="item tabs tabs-secondary tabs-icon-left">
        <a class="tab-item" ng-click="takeAPicture()">
            <i class="icon ion-ios7-camera-outline"></i>
            Take a picture
        </a>
        <a class="tab-item" ng-click="browseForAPicture()">
            <i class="icon ion-ios7-photos-outline"></i>
            Browse gallery
        </a>
    </div>
</div>
