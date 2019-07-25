package com.cgc.tools.codegen.wizards;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jface.wizard.IWizardPage;
import org.eclipse.jface.wizard.WizardPage;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.FillLayout;
import org.eclipse.swt.layout.FormAttachment;
import org.eclipse.swt.layout.FormData;
import org.eclipse.swt.layout.FormLayout;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Combo;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Label;

import com.cgc.tools.codegen.util.Constants;
import com.cgc.tools.codegen.util.ValueStore;




/**
 * <h3>��ҳ</h3>
 * <p>Hibernateӳ���ļ���������</p>
 * 
 * @author Jerry Shang
 * @version 1.0
 *
 */
public class HbmConfigPage extends WizardPage {
    private static final Log log = LogFactory.getLog(HbmConfigPage.class);
    private Combo cboIdType;
    private Combo cboGenerator;
    private Button rdoHibernateTypes;
    private Button chkReservePrefix;
    private Button chkAnnotation;
    private Button rdoJavaTypes;

    public HbmConfigPage(String pageName) {
        super(pageName);
        log.debug("init hbm config page");
        setTitle(Constants.WIZARDNAME);
        setDescription("please select mapping parameters.");
    }

    public void createControl(Composite parent) {
        Composite pp = new Composite(parent, SWT.NULL);
        pp.setLayoutData(new GridData(GridData.FILL_BOTH));
        pp.setLayout(new FillLayout());
        createDialogArea(pp);
        setControl(pp);
    }

    protected Control createDialogArea(final Composite parent) {
        Composite composite = new Composite(parent, SWT.NONE);
        FormLayout formLay = new FormLayout();
        formLay.marginHeight = formLay.marginWidth = 10;
        composite.setLayout(formLay);

        Label lblSchemaExport = new Label(composite, SWT.NONE);
        lblSchemaExport.setText("PK generator");

        FormData data6 = new FormData();
        data6.top = new FormAttachment(0, 12);
        data6.left = new FormAttachment(0, 12);
        lblSchemaExport.setLayoutData(data6);
        cboGenerator = new Combo(composite, SWT.DROP_DOWN | SWT.READ_ONLY);
        cboGenerator.setItems(Constants.schemaExport);

        cboGenerator.select(0);

        Label lblKeyFieldType = new Label(composite, SWT.NONE);
        lblKeyFieldType.setText("mapping data type");

        FormData data8 = new FormData();
        data8.top = new FormAttachment(lblSchemaExport, 12);
        data8.left = new FormAttachment(0, 12);
        lblKeyFieldType.setLayoutData(data8);

        FormData data7 = new FormData();
        data7.left = new FormAttachment(lblKeyFieldType, 12);
        data7.top = new FormAttachment(0, 12);
        data7.right = new FormAttachment(100, -12);
        cboGenerator.setLayoutData(data7);

        rdoHibernateTypes = new Button(composite, SWT.RADIO);
        rdoHibernateTypes.setText("Hibernate type");
        rdoHibernateTypes.addSelectionListener(new SelectionListener() {
                public void widgetSelected(SelectionEvent e) {
                    int i = cboIdType.getSelectionIndex();
                    cboIdType.setItems(Constants.hibernateKeyFields);
                    cboIdType.select(i);
                }

                public void widgetDefaultSelected(SelectionEvent e) {
                }
            });

        FormData data9 = new FormData();
        data9.top = new FormAttachment(lblSchemaExport, 12);
        data9.left = new FormAttachment(lblKeyFieldType, 12);
        rdoHibernateTypes.setLayoutData(data9);

        rdoJavaTypes = new Button(composite, SWT.RADIO);
        rdoJavaTypes.setText("Java type");
        rdoJavaTypes.addSelectionListener(new SelectionListener() {
                public void widgetSelected(SelectionEvent e) {
                    int i = cboIdType.getSelectionIndex();
                    cboIdType.setItems(Constants.javaKeyFields);
                    cboIdType.select(i);
                }

                public void widgetDefaultSelected(SelectionEvent e) {
                }
            });

        FormData data10 = new FormData();
        data10.top = new FormAttachment(lblSchemaExport, 12);
        data10.left = new FormAttachment(rdoHibernateTypes, 12);
        rdoJavaTypes.setLayoutData(data10);

        Label lblKeyField = new Label(composite, SWT.NONE);
        lblKeyField.setText("pk class");

        FormData data11 = new FormData();
        data11.top = new FormAttachment(lblKeyFieldType, 12);
        data11.left = new FormAttachment(0, 12);
        lblKeyField.setLayoutData(data11);
        cboIdType = new Combo(composite, SWT.DROP_DOWN | SWT.READ_ONLY);
        cboIdType.setItems(Constants.hibernateKeyFields);

        FormData data12 = new FormData();
        data12.top = new FormAttachment(lblKeyFieldType, 12);
        data12.left = new FormAttachment(lblKeyFieldType, 12);
        data12.right = new FormAttachment(100, -12);
        cboIdType.setLayoutData(data12);

        Label lblMisc = new Label(composite, SWT.NONE);
        lblMisc.setText("misc");

        FormData data15 = new FormData();
        data15.top = new FormAttachment(lblKeyField, 12);
        data15.left = new FormAttachment(0, 12);
        lblMisc.setLayoutData(data15);
        chkReservePrefix = new Button(composite, SWT.CHECK);
        chkReservePrefix.setText("keep field prefix");
        chkReservePrefix.setSelection(false);
        chkReservePrefix.addSelectionListener(new SelectionListener(){
			public void widgetSelected(SelectionEvent e) {
				ValueStore.reservePrefix = chkReservePrefix.getSelection();
			}
			public void widgetDefaultSelected(SelectionEvent e) {
			}
        });

        FormData data16 = new FormData();
        data16.top = new FormAttachment(lblKeyField, 12);
        data16.left = new FormAttachment(lblKeyFieldType, 12);
        chkReservePrefix.setLayoutData(data16);

        chkAnnotation = new Button(composite, SWT.CHECK);
        chkAnnotation.setText("generate annotation POJO");
        chkAnnotation.setSelection(true);
        chkAnnotation.addSelectionListener(new SelectionListener(){
			public void widgetSelected(SelectionEvent e) {
				ValueStore.isAnnotation = chkAnnotation.getSelection();
			}
			public void widgetDefaultSelected(SelectionEvent e) {
			}
        });
        FormData data17 = new FormData();
        data17.top = new FormAttachment(lblKeyField, 36);
        data17.left = new FormAttachment(lblKeyFieldType, 12);
        chkAnnotation.setLayoutData(data17);

        rdoHibernateTypes.setSelection(false);
        rdoJavaTypes.setSelection(true);

        cboIdType.setItems(Constants.javaKeyFields);

        cboIdType.select(0);

        return composite;
    }

    /* (non-Javadoc)
     * @see org.eclipse.jface.wizard.IWizardPage#getNextPage()
     */
    public IWizardPage getNextPage() {
//        if (ValueStore.genOrNot[Constants.QUERYPARAM]) {
//            return ((CodegenNewWizard) getWizard()).paramsPage;
//        }

        return ((CodegenNewWizard) getWizard()).lastPage;
    }

    /**
     * @return ��������
     */
    public String getIdType() {
        return cboIdType.getText();
    }

    /**
     * @return ӳ���ļ����Ƿ�ʹ��Java��������
     */
    public boolean isJavaTypes() {
        return rdoJavaTypes.getSelection();
    }

    /**
     * @return ����������
     */
    public String getGenerator() {
        return cboGenerator.getText();
    }

    /**
     * @return �Ƿ����ֶ�ǰ׺
     */
    public boolean isReservePrefix() {
        return chkReservePrefix.getSelection();
    }
}
