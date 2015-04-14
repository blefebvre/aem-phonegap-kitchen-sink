package com.brucelefebvre.wcm;
  
import com.adobe.cq.sightly.WCMUse;
import com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils;
//import com.adobe.cq.mobile.platform.MobileResourceLocator;
import org.apache.sling.api.resource.Resource;
import com.day.cq.wcm.api.Page;
import com.day.cq.commons.Externalizer;
import org.apache.sling.api.resource.ValueMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;
  
public class PageHelper extends WCMUse {

    Resource topLevelAppResource;
    boolean appExport;
    Resource imageResource;
    String imageSrc;
    Page page;
    //MobileResourceLocator locator;

    private static final String PGE_TYPE_PROP = "pge-type";
    private static final String APP_GROUP_VAL = "app-group";
    private static final String APP_CONTENT_VAL = "app-content";

    @Override
    public void activate() throws Exception {
        page = get("page", Page.class);
        topLevelAppResource = FrameworkContentExporterUtils.getTopLevelAppResource(page.adaptTo(Resource.class));
        appExport = Boolean.parseBoolean(getRequest().getParameter("appExport"));
        imageResource = page.getContentResource("image");
        //locator = resource.getResourceResolver().adaptTo(MobileResourceLocator.class);
    }

    public String getRelPathToPageImage() {
        if (imageResource != null) {
            imageSrc = page.getPath() + ".img.png";
            imageSrc = FrameworkContentExporterUtils.getPathToAsset(topLevelAppResource, imageSrc, appExport);
            
            return imageSrc;
        }

        return null;
    }

    public String getRelativePathToRoot() {
        return FrameworkContentExporterUtils.getRelativePathToRootLevel(page.adaptTo(Resource.class));
    }

    public String getJsFriendlyResourceName() {
        return FrameworkContentExporterUtils.getJsFriendlyResourceName(page.adaptTo(Resource.class).getPath());
    }

    public String getExternalizedPublishUri() {
		Externalizer externalizer = getResourceResolver().adaptTo(Externalizer.class);
        return externalizer.publishLink(getResourceResolver(), "/");
    }

    public ValueMap getAppProperties() {
        return topLevelAppResource.getParent().adaptTo(Page.class).getProperties();
    }

    public String getRelativePathToCurrentResource() {
        return FrameworkContentExporterUtils.getRelativePathToDescendantResource(
            page.adaptTo(Resource.class), getResourcePage().adaptTo(Resource.class));
    }

    public List<Resource> getAllAngularPageComponents() {
        return FrameworkContentExporterUtils.getAllAngularPageComponents(page.getContentResource());
    }

    public String getServerURL() {
		return getAppProperties().get("serverURL", "");
    }

    public boolean isTopLevelAppResource() {
        return FrameworkContentExporterUtils.isTopLevelAppResource(page.adaptTo(Resource.class));
    }

    public Page getAppGroupPage() {
        Page parentPage = topLevelAppResource.adaptTo(Page.class).getParent();
        // Top level app resource is not the app group, so we'll begin 
        // searching at it's parent.
        while (parentPage != null) {
            ValueMap pageValueMap = parentPage.getProperties();
            String type = pageValueMap.get(PGE_TYPE_PROP, "");
            if (APP_GROUP_VAL.equals(type)) {
                // App group page located
                return parentPage;
            }
            parentPage = parentPage.getParent();
        }

        // No app group page found
        return null;
    }

    /**
     * Return a list of this app's content pages which are defined as 
     * descendants of an "pge-type": "app-group" page node possessing the prop
     * "pge-type": "app-content".
     *
     */
    public List<Page> getAppContentPages() {
        Page appGroupPage = getAppGroupPage();
        List<Page> contentPages = new ArrayList<Page>();

        if (appGroupPage != null) {
            Iterator<Page> appGroupChildIter = appGroupPage.listChildren();
            while (appGroupChildIter.hasNext()) {
                Page currenAppPage = appGroupChildIter.next();
                ValueMap pageProps = currenAppPage.getProperties();
                String pgeType = pageProps.get(PGE_TYPE_PROP, "");
                if (APP_CONTENT_VAL.equals(pgeType)) {
                    contentPages.add(currenAppPage);
                }
            }
        }

        return contentPages;
    }

}