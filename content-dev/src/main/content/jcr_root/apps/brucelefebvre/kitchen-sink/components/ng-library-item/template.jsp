<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false"
           import="com.day.cq.i18n.I18n" %>
<cq:include script="overhead.jsp"/><%
    I18n i18n = new I18n(slingRequest);
%>
<div class="list card" ng-repeat="product in <c:out value='${componentDataPath}'/>">
    <div class="item">
        <h2>{{product.title}}</h2>
        <p>by {{product.author}}</p>
    </div>

    <div class="item item-body">
        <img class="full-image" ng-src="{{product.imageSrc}}" alt="{{product.description}}" title="{{product.description}}">

        <p>
            {{product.price}}
        </p>
        <p>
            {{product.description}}
        </p>
    </div>

    <div class="item tabs tabs-secondary tabs-icon-left">
        <a class="tab-item">
            <i class="icon ion-thumbsup"></i>
            Like
        </a>
        <a class="tab-item">
            <i class="icon ion-chatbox"></i>
            Comment
        </a>
        <a class="tab-item">
            <i class="icon ion-share"></i>
            Share
        </a>
    </div>
</div>