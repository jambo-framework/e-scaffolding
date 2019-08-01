package com.cgc.tools.codegen.generators;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import java.util.Properties;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.app.VelocityEngine;

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

    public void generateBatch(Map<String, String> map) throws Exception {
        String pkgFolder = (pkgName == null) ? ""
                                             : (pkgName.replace(StringHelper.DOT,
                File.separatorChar));

        File dir = new File(webFolder, pkgFolder);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        Template template =  null;
        VelocityEngine velocityEngine = new VelocityEngine();
        VelocityContext context = getContext() ;
        PrintWriter writer = null;

//        temp = getTempleFile() ;
        File file;
        File fileDir;
        String fileName;
        String templateName;
        Properties properties = new Properties();
        String basePath = "C:\\ECF\\Hackthon\\my\\e-scaffolding\\src\\template\\";
        properties.setProperty(Velocity.FILE_RESOURCE_LOADER_PATH, basePath);
        velocityEngine.init(properties);
        for (Map.Entry<String, String> entry : map.entrySet()) {   
       	
        	fileName = entry.getKey();
        	fileName = fileName.replaceAll("hammer", (String)context.get("pojoLowercase"));
        	file = new File(dir, fileName);
        	fileDir = new File(dir, fileName.substring(0, fileName.lastIndexOf(File.separatorChar)));
        	if (!fileDir.exists()) {
        		fileDir.mkdirs();
            }
            log.debug("save file to: " + file.getAbsolutePath());
            templateName = entry.getValue();

            StringBuffer source = new StringBuffer(TemplatesUtils.getInstence().getString(fileName,templateName)) ;
            File tmpFile = new File(basePath + templateName);
            if (!tmpFile.getParentFile().exists()) {
            	tmpFile.getParentFile().mkdirs();
            }
    		WriteFile.write(basePath + templateName , source) ;

        	try {
		        template = velocityEngine.getTemplate(templateName);
				writer = new PrintWriter(new FileOutputStream(file));
		        if ( template != null){
		            template.merge(context, writer);
		        }
		        writer.flush() ;
	        }catch (Exception e){
	        	log.error(e);
	        	e.printStackTrace();
	        } finally{
	            if (writer != null) writer.close();
	    		File f = new File(templateName) ;
	    		f.delete() ;
	        }
        }   
    }

	@Override
	protected Object getPK() {
		// TODO Auto-generated method stub
		return null;
	}

}
