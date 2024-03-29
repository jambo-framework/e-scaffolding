package com.cgc.tools.codegen.wizards;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.app.Velocity;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.preference.IPreferenceStore;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.Wizard;
import org.eclipse.ui.INewWizard;
import org.eclipse.ui.IWorkbench;

import com.cgc.tools.codegen.CodegenPlugin;
import com.cgc.tools.codegen.generators.ActionGenerator;
import com.cgc.tools.codegen.generators.BOClassGenerator;
import com.cgc.tools.codegen.generators.ContentPageGenerator;
import com.cgc.tools.codegen.generators.DBQueryParamGenerator;
import com.cgc.tools.codegen.generators.DaoGenerator;
import com.cgc.tools.codegen.generators.EntryPageGenerator;
import com.cgc.tools.codegen.generators.FormGenerator;
import com.cgc.tools.codegen.generators.I18nGenerator;
import com.cgc.tools.codegen.generators.ListPageGenerator;
import com.cgc.tools.codegen.generators.MapGenerator;
import com.cgc.tools.codegen.generators.ServiceGenerator;
import com.cgc.tools.codegen.generators.ServiceImplGenerator;
import com.cgc.tools.codegen.generators.TestGenerator;
import com.cgc.tools.codegen.preferences.PreferenceConstants;
import com.cgc.tools.codegen.util.Constants;
import com.cgc.tools.codegen.util.ValueStore;

public class CodegenNewWizard extends Wizard implements INewWizard {
	private static final Log log = LogFactory.getLog(CodegenNewWizard.class);

	ProductPage productPage;
	
	SetNamesPage namesPage;

	SetFoldersPage foldersPage;

	HbmConfigPage hbmPage;

	ParamsObjPage paramsPage;

	private SelTablePage tablePage;

	LastPage lastPage;
	
	private boolean isCloseConn = true ; //是否生成代码后既关闭连接

	/**
	 * Constructor for CodegenNewWizard.
	 */
	public CodegenNewWizard() {
		super();
		setNeedsProgressMonitor(true);
	}

	/**
	 * Adding the page to the wizard.
	 */
	public void addPages() {
		if (ValueStore.connection == null)
			return;
		productPage = new ProductPage("productPage");
		addPage(productPage);
		tablePage = new SelTablePage("tablePage");
		addPage(tablePage);
		namesPage = new SetNamesPage("namesPage");
		addPage(namesPage);
		foldersPage = new SetFoldersPage("foldersPage");
		addPage(foldersPage);
		hbmPage = new HbmConfigPage("hbmPage");
		addPage(hbmPage);
		paramsPage = new ParamsObjPage("paramsPage");
		addPage(paramsPage);
		lastPage = new LastPage("lastPage");
		addPage(lastPage);
	}

	public void init(IWorkbench workbench, IStructuredSelection selection) 
			{
		connect();
		System.out.println(selection.getFirstElement()) ;
	}

	private void connect() {
		Connection conn = null;
		IPreferenceStore store = CodegenPlugin.getDefault()
				.getPreferenceStore();
		String driverName = store.getString(PreferenceConstants.DRIVER_CLASS);
		String url = store.getString(PreferenceConstants.CONNECTION_URL);
		System.out.println("url=" + url);
		String user = store.getString(PreferenceConstants.USER);
		String pswd = store.getString(PreferenceConstants.PASSWORD);
		ValueStore.numPrefix = store.getInt(PreferenceConstants.PREFIX) ;
		ValueStore.author = store.getString(PreferenceConstants.AUTHOR);
		ValueStore.framework = store.getString(PreferenceConstants.FRAMEWORK);
		
		//2013-4-27 jinbo 增加项目包名称与模板目录名称
		ValueStore.projname= store.getString(PreferenceConstants.PROJECT_NAME);
		ValueStore.templatePath= store.getString(PreferenceConstants.TEMPLATE_PATH);
		
		try {
			//2013-4-28 jinbo 获取字段的注释
			Properties props =new Properties();
			props.put("user",user); 
			props.put("password",pswd); 
			props.put("remarksReporting","true");
			
			Class.forName(driverName);
			conn = DriverManager.getConnection(url, props);// .getConnection(url, user, pswd);
		} catch (Exception e) {
			e.printStackTrace();
			MessageDialog.openError(null, "Connection Error", e.getMessage());
		}
		ValueStore.connection = conn;
	}

	public boolean performFinish() {
		try{
			//compatible for 1.x
//			Velocity.setProperty("introspector.conversion_handler.class", "none"); 
//			Velocity.setProperty("parser.space_gobbling", "bc");
//			Velocity.setProperty("directive.if.empty_check ", "false");
//			Velocity.setProperty("parser.allow_hyphen_in_identifiers", "true");
//			Velocity.setProperty("velocimacro.arguments.preserve_literals", "true");

			Velocity.init();
			
		}catch(Exception e){
		}
		IPreferenceStore store = CodegenPlugin.getDefault()
		.getPreferenceStore();
		// TODO 移动模板文件,检查模板文件
		File file = new File("template") ;
		if (!file.isDirectory()){
			file.mkdir() ;
		} else {
			file.delete();
		}

		log.debug("copy params to generate codes....");
		ValueStore.tableName = tablePage.getTableName();
		ValueStore.baseClassName = namesPage.getBaseClassName();
		ValueStore.genOrNot = namesPage.getNeedGenerate();
		ValueStore.srcFolder = foldersPage.getSrcFolder();
		ValueStore.testFolder = foldersPage.getTestFolder();
		ValueStore.webFolder = foldersPage.getWebFolder();
		MapGenerator mg = new MapGenerator();
		mg.setTableName(tablePage.getTableName());
		mg.setSrcFolder(new File(ValueStore.srcFolder));
		
		mg.setHbmFileName(ValueStore.baseClassName + ".hbm.xml");		
		mg.setPoClassName(ValueStore.baseClassName + "Entity");
		mg.setGenerator(hbmPage.getGenerator());
		mg.setIdType(hbmPage.getIdType());
		mg.setJavaTypes(hbmPage.isJavaTypes());
		mg.setReservePrefix(hbmPage.isReservePrefix());
		mg.setSchemaPattern(store.getString(PreferenceConstants.SCHEMA)) ;
		mg.setCatalog(store.getString(PreferenceConstants.CATALOG)) ;
		// 生成dao类
		DaoGenerator msGen = new DaoGenerator();
		// 生成 DBQueryParam
		DBQueryParamGenerator paramGen = new DBQueryParamGenerator(paramsPage.getFieldList());
		//生成ejb接口和类
//		EjbInterfaceGenerator ejbig = new EjbInterfaceGenerator();
		
		BOClassGenerator boGen = new BOClassGenerator();
		
		I18nGenerator i18Gen = new I18nGenerator();
		
		ActionGenerator actionGen = new ActionGenerator();
		FormGenerator formGen = new FormGenerator(paramsPage.getFieldList());
//		WebParamGenerator wg = new WebParamGenerator(paramsPage.getFieldList()) ;
		
		ListPageGenerator listGen = new ListPageGenerator();
		ContentPageGenerator contentGen = new ContentPageGenerator();
		
		TestGenerator testGen = new TestGenerator();

		EntryPageGenerator entryGen = new EntryPageGenerator(); 

		
		ServiceGenerator serviceGen = new ServiceGenerator();
		ServiceImplGenerator serviceImplGen = new ServiceImplGenerator();
		try {
			//hibernate
			if (ValueStore.connection != null){
				mg.generate(ValueStore.connection); 
			}
			//BACKEND
			if (ValueStore.genOrNot[Constants.BACKEND]) {
				msGen.generate();
				boGen.generate();
				paramGen.generate();
			}
			//dao
//			if (ValueStore.genOrNot[Constants.DAO]) {
//				msGen.generate();
//			}
			//dbqueryparam
//			if(ValueStore.genOrNot[Constants.QUERYPARAM]){
//				paramGen.generate();
//			}
			//bo
//			if(ValueStore.genOrNot[Constants.EJB]){
//				boGen.generate();
//			}
			//I18N资源 
//			if(ValueStore.genOrNot[Constants.I18N]){
//				i18Gen.generate();
//			}
			//action
			if(ValueStore.genOrNot[Constants.WEB]){				
//				actionGen.generate();
//				formGen.generate();
				
				Map<String, String> map = new HashMap<String, String>();
				File templatesDir = new File("C:\\projects\\GitHub\\e-scaffolding\\src\\template\\jambo\\portal");
				ArrayList<File> fileList = this.getFiles(templatesDir.getAbsolutePath(), new ArrayList<File>());
				
				for(File filetemp:fileList) {
					String fileStr = filetemp.getAbsolutePath().substring(templatesDir.getAbsolutePath().length());
					fileStr = fileStr.substring(0, fileStr.length() - 9);
					String fileTempStr = filetemp.getAbsolutePath().substring(templatesDir.getAbsolutePath().length() - 6);
					map.put(fileStr, fileTempStr);
				}				
				entryGen.generateBatch(map); //*.tsx
			
			}
			//web页面
//			if(ValueStore.genOrNot[Constants.PAGE]){
//				listGen.generate();
//				contentGen.generate();
//			}
			//test
//			if(ValueStore.genOrNot[Constants.TEST]){
//				testGen.generate();
//			}
			
//			if(ValueStore.genOrNot[Constants.DUBBO]){
//				serviceGen.generate();
//				serviceImplGen.generate();
//			}
			
			if (isCloseConn){
				ValueStore.connection.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
    		MessageDialog.openInformation(null, "init velocity", e.toString()) ;
		} finally {
			ValueStore.connection = null;
//			File file = new File("template") ;
			if (file != null){
				file.delete() ;
			}
		}

		log.debug("finished!");
		return true;
	}
	
	public void setCloseConnFlag(boolean flag){
		this.isCloseConn = flag ;
	}
	
	public ArrayList<File> getFiles(String path, ArrayList<File> fileList) throws Exception {
		//目标集合fileList
		File file = new File(path);
		if(file.isDirectory()){
			File []files = file.listFiles();
				for(File fileIndex:files){
					//如果这个文件是目录，则进行递归搜索
					if(fileIndex.isDirectory()){
						getFiles(fileIndex.getPath(), fileList);
					}else {
						//如果文件是普通文件，则将文件句柄放入集合中
						fileList.add(fileIndex);
					}
				}
			}
		return fileList;
		}
}
