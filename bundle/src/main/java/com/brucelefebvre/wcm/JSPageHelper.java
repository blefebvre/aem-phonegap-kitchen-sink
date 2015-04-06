package com.brucelefebvre.wcm;
  
import com.adobe.cq.sightly.WCMUse;
import org.apache.sling.api.resource.Resource;
import com.day.cq.wcm.api.Page;
  
public class JSPageHelper extends PageHelper {

    @Override
    public void activate() throws Exception {
        super.activate();
        getResponse().setContentType("application/javascript");
    }
}