<%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false"
           import="com.day.cq.i18n.I18n" %>
<cq:include script="overhead.jsp"/><%
    I18n i18n = new I18n(slingRequest);
%><%
%><article class="product-details" ng-repeat="product in <c:out value='${componentDataPath}'/>" ng-controller="ProductCtrl">
    <div class="product-header">
        <span class="name">{{product.name}}</span>
        <span class="price">{{product.price}}</span>
    </div>

    <div class="product-image">
        <cq:include path="ng-image" resourceType="geometrixx-outdoors-app/components/angular/ng-image" />

        <div class="metrics">
            <div class="metrics-button likes">{{product.numberOfLikes}}
                <%-- Include SRC in the IMG's below to support FireFox and IE, which do not support CSS content
                    changing. --%>
                <img class="thumbsup_img_src" height="24px"
                     alt="<%= i18n.get("Number of Likes") %>">
            </div>
            <div class="metrics-button comments">{{product.numberOfComments}}
                <img class="comment_img_src" height="24px"
                     alt="<%= i18n.get("Number of Comments") %>">
            </div>
            <div class="add-to-cart" data-sku="{{product.SKU}}">
                <img class="added_img_src clear" height="40px"
                     alt="<%= i18n.get("Add to cart") %>">
                <img class="add_img_src" height="40px"
                     alt="<%= i18n.get("Add to cart") %>"
                     ng-click="addToCartClickHandler($event)">
            </div>
        </div>
    </div>

    <div class="product-details-information">
        <h4 class="product-details-description">{{product.description}}</h4>
        <div class="product-details-summary" ng-bind-html="product.summaryHTML"></div>
    </div>

    <div class="product-comments">

    </div>
</article>