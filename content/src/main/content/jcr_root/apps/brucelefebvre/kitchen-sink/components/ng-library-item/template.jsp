<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false"
           import="com.day.cq.i18n.I18n" %>
<cq:include script="overhead.jsp"/><%
    I18n i18n = new I18n(slingRequest);
%><%
%><article class="product-details" ng-repeat="product in <c:out value='${componentDataPath}'/>">
    <div class="product-header">
        <span class="name">{{product.title}}</span>
        <span class="price">by {{product.author}}</span>
    </div>
    <div class="product-header">
        {{product.price}}
    </div>

    <div class="product-details-information">
        <h4 class="product-details-description">{{product.description}}</h4>
    </div>

    <img ng-src="{{product.imageSrc}}" alt="{{product.description}}" title="{{product.description}}"/>
</article>