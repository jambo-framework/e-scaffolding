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

public class EntryPageGenerator extends BasePageGenerator {

	public EntryPageGenerator() {
		super();
        webFolder = ValueStore.webFolder;
        pkgName = getWebPkg();
        pageName = "entry.tsx";
	}
   
    
    public String getTempleFile() throws IOException {
		String fileName = "EntryTemplet.templets" ;
//		if (framework.equals("JSF")){
//			fileName = "JsfBeanTemplet.templets" ;
//		}

		StringBuffer source = new StringBuffer(TemplatesUtils.getInstence().getString("List",fileName)) ;
		WriteFile.write("template/EntryTemplet.templets", source) ;

		return "template/EntryTemplet.templets" ;
    }


	@Override
	protected Object getPK() {
		// TODO Auto-generated method stub
		return null;
	}

}
