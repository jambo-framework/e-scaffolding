package com.cgc.tools.codegen.wizards;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jface.wizard.IWizardPage;
import org.eclipse.jface.wizard.WizardPage;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.FillLayout;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;

import com.cgc.tools.codegen.util.Constants;
import com.cgc.tools.codegen.util.ValueStore;

public class ProductPage extends WizardPage {
	private static final Log log = LogFactory.getLog(ProductPage.class);
	private boolean isPrevious = true ; //是否能点击上一页

	private boolean createFlag = false ;
	private Button reactorTypes;
	private Button uvprofileTypes;
	private Button dispatcherTypes;
	private Button ecfTypes; 
	public ProductPage(String pageName){
		super(pageName);
		log.debug("select product page");
		setTitle(Constants.WIZARDNAME);
		setDescription("select the product which want to generate.");	}
	
	public void createControl(Composite parent) {
		Composite pp = new Composite(parent, SWT.NULL);
		pp.setLayoutData(new GridData(GridData.FILL_BOTH));
        pp.setLayout(new FillLayout());
        
        
        ecfTypes = new Button(pp, SWT.RADIO);
        ecfTypes.setText("ECF");
        ecfTypes.setSelection(true);
        reactorTypes = new Button(pp, SWT.RADIO);
        reactorTypes.setText("Reactor");
        uvprofileTypes = new Button(pp, SWT.RADIO);
        uvprofileTypes.setText("UV Profile");
        dispatcherTypes = new Button(pp, SWT.RADIO);
        dispatcherTypes.setText("Dispatcher");

        createReviewArea(pp);
		setControl(pp);
	}
	public IWizardPage getNextPage() {
		SelTablePage page = (SelTablePage) getWizard().getNextPage(this);

        return page;
    }
	
	public void setCreateFlag(boolean flag){
		this.createFlag = flag ;
	}
	public void createReviewArea(Composite composite){
		
	}
	public void setPreviousAble(boolean flag) {
		this.isPrevious = flag ;
	}
	
	public IWizardPage getPreviousPage(){
		if (isPrevious){
			return super.getPreviousPage() ;
		} else {
			return null ;
		}
	}
}
