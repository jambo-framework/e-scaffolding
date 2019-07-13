package com.cgc.tools.codegen.generators;

import java.io.IOException;
import java.util.Date;

import org.apache.velocity.VelocityContext;

import com.cgc.tools.codegen.util.Constants;
import com.cgc.tools.codegen.util.TemplatesUtils;
import com.cgc.tools.codegen.util.ValueStore;
import com.cgc.tools.codegen.util.WriteFile;

public class ServiceImplGenerator extends BaseGenerator {

    public ServiceImplGenerator() {
        this.className = getServiceImplClassName();
        this.srcFolder = ValueStore.srcFolder;
        this.pkgName = getServiceImplPkg();
    }

	public String getTempleFile() throws IOException {
		String fileName = "ServiceImplTemplet.templets" ;

		StringBuffer source = new StringBuffer(TemplatesUtils.getInstence().getString("ServiceImpl",fileName)) ;
		WriteFile.write("template/ServiceImplTemplet.templets", source) ;

		return "template/ServiceImplTemplet.templets" ;
	}
}
