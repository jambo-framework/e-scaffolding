package com.cgc.tools.codegen.preferences;

import org.eclipse.jface.preference.BooleanFieldEditor;
import org.eclipse.jface.preference.FieldEditorPreferencePage;
import org.eclipse.jface.preference.IntegerFieldEditor;
import org.eclipse.jface.preference.StringFieldEditor;
import org.eclipse.ui.IWorkbench;
import org.eclipse.ui.IWorkbenchPreferencePage;

import com.cgc.tools.codegen.CodegenPlugin;
import com.cgc.tools.codegen.preferences.editors.ComboFieldEditor;
import com.cgc.tools.codegen.preferences.editors.PasswordFieldEditor;



public class DatabasePage extends FieldEditorPreferencePage implements
		IWorkbenchPreferencePage {

	public DatabasePage() {
		super(GRID);
		setPreferenceStore(CodegenPlugin.getDefault().getPreferenceStore());
		setDescription("General database connection preference:");
	}

	protected void createFieldEditors() {
		addField(new ComboFieldEditor(PreferenceConstants.DRIVER_CLASS,
				"&Driver Class:", 40, new String[] {
//						"com.informix.jdbc.IfxDriver",
						"com.mysql.jdbc.Driver",
//				"oracle.jdbc.driver.OracleDriver", 
						"org.postgresql.Driver"
						},
				getFieldEditorParent()));
		addField(new StringFieldEditor(PreferenceConstants.CONNECTION_URL,
				"C&onnection URL:", 48, getFieldEditorParent()));
		addField(new StringFieldEditor(PreferenceConstants.USER, "&User name:",
				20, getFieldEditorParent()));
		addField(new PasswordFieldEditor(PreferenceConstants.PASSWORD,
				"&Password", 20, getFieldEditorParent()));
		addField(new StringFieldEditor(PreferenceConstants.CATALOG, "&Catalog",
				30, getFieldEditorParent()));
		addField(new StringFieldEditor(PreferenceConstants.SCHEMA, "&Schema",
				30, getFieldEditorParent()));
		addField(new IntegerFieldEditor(PreferenceConstants.PREFIX, "&Prefix",
				getFieldEditorParent(), 10));
		addField(new BooleanFieldEditor(PreferenceConstants.TABLEONLY,
				"Show &tables only", getFieldEditorParent()));

	}

	public void init(IWorkbench workbench) {
		// TODO Auto-generated method stub

	}

}
