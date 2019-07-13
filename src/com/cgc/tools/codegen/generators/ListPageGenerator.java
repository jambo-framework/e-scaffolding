package com.cgc.tools.codegen.generators;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.velocity.VelocityContext;

import com.cgc.tools.codegen.util.FieldsHelper;
import com.cgc.tools.codegen.util.StringHelper;
import com.cgc.tools.codegen.util.TemplatesUtils;
import com.cgc.tools.codegen.util.ValueStore;
import com.cgc.tools.codegen.util.WriteFile;

public class ListPageGenerator extends BasePageGenerator {

	public ListPageGenerator() {
		super();
        webFolder = ValueStore.webFolder;
        pkgName = getWebPkg();
        pageName = "list";
	}
    
	/*public VelocityContext getContext() {
		VelocityContext context = new VelocityContext();
		context.put("includeFile", getIncludeFile()) ;
		context.put("helper", helper) ;
		context.put("moduleName", ValueStore.moduleName) ;
		context.put("baseClassName", ValueStore.baseClassName.toLowerCase()) ;
		if (framework.equals("JSF")){
			context.put("faceName", getFaceName()) ;
		} else {
			List len = new ArrayList() ;
			List type = new ArrayList() ;
            Collections.addAll(len, helper.getLength()) ;
            Collections.addAll(type, helper.getJSType()) ;
            context.put("lens", len) ;
            context.put("types", type) ;
            context.put("pk", getPK()) ;
            context.put("paramColumn", helper.paramColumn) ;
		}

    	return context ;
    }*/
    
    public String getTempleFile() throws IOException {
		String fileName = "ListTemplet.templets" ;
//		if (framework.equals("JSF")){
//			fileName = "JsfBeanTemplet.templets" ;
//		}

		StringBuffer source = new StringBuffer(TemplatesUtils.getInstence().getString("List",fileName)) ;
		WriteFile.write("template/ListTemplet.templets", source) ;

		return "template/ListTemplet.templets" ;
    }

	protected String getPK() {
        String pks = ValueStore.pkFields;
        if (pks==null)
        	return null;
        pks = pks.replaceAll("\"", "");
        if (pks.indexOf(",") < 0)
            return StringHelper.makeMemberName(pks.trim(),0);
        String[] pkArray = pks.split(",");
        StringBuffer buffer = new StringBuffer().append(StringHelper.makeMemberName(pkArray[0].trim(),0));
        for (int i = 1; i < pkArray.length; i++) {
            buffer.append(" + '|' + ").append(StringHelper.makeMemberName(pkArray[i].trim(),0));
        }
        return buffer.toString();
    }
	
	
	/**
	    * �����ݿ��е�����������Ϊjava�ֶε�����������CUST_ID תΪcustId
	    * @author Yu Xinhua(Levin)
	    * @return
	    */
	    private String getFormatPK() {
	        String pks = ValueStore.pkFields;
	        if (pks == null) {
	            return null;
	        }
	        pks = pks.replaceAll("\"", "");
	        if (pks.indexOf(",") < 0) {
	            return "\""+StringHelper.makeMemberName(pks, 0)+"\"";
	        }
	        String[] pkArray = pks.split(",");
	        StringBuffer pkBuffer = new StringBuffer();
	        for (int i = 0; i < pkArray.length; i++) {
	            pkBuffer.append("\"").append(StringHelper.makeMemberName(pkArray[i], 0)).append("\"");
	            if(i<pkArray.length-1){
	                pkBuffer.append(",");
	            }
	        }
	        return pkBuffer.toString();

	    }
}
