package com.brucelefebvre.wcm;
  
import com.adobe.cq.sightly.WCMUse;
import com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils;
import org.apache.sling.api.resource.Resource;
import com.day.cq.wcm.api.Page;
import com.day.cq.commons.Externalizer;
import org.apache.sling.api.resource.ValueMap;
import java.util.List;
  
public class PageHelper extends WCMUse {

    Resource topLevelAppResource;
    boolean appExport;
    Resource imageResource;
    String imageSrc;
    Page page;

    @Override
    public void activate() throws Exception {
        page = get("page", Page.class);
        topLevelAppResource = FrameworkContentExporterUtils.getTopLevelAppResource(page.adaptTo(Resource.class));
        appExport = Boolean.parseBoolean(getRequest().getParameter("appExport"));
        imageResource = page.getContentResource("image");
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
}