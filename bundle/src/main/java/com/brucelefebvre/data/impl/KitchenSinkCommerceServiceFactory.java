package com.brucelefebvre.data.impl;

import com.adobe.cq.commerce.api.CommerceService;
import com.adobe.cq.commerce.api.CommerceServiceFactory;
import com.adobe.cq.commerce.common.AbstractJcrCommerceServiceFactory;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;

/**
 * Kitchen sink specific implementation for the {@link CommerceServiceFactory} interface.
 */
@Component
@Service
@Properties(value = {
        @Property(name = "service.description", value = "Factory for reference implementation commerce service"),
        @Property(name = "commerceProvider", value = "kitchensink", propertyPrivate = true)
})
public class KitchenSinkCommerceServiceFactory extends AbstractJcrCommerceServiceFactory implements CommerceServiceFactory {

    /**
     * Create a new <code>KitchenSinkCommerceServiceImpl</code>.
     */
    public CommerceService getCommerceService(Resource res) {
        return new KitchenSinkCommerceServiceImpl(getServiceContext(), res);
    }
}