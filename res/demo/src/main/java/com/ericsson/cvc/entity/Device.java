package com.ericsson.cvc.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
 
@Entity
@Table(name = "device")
public class Device extends BaseEntity{
	@Column(name = "description")
	private String description;
	@Column(name="externalId")
    private String externalId;
	@Column
    private String iccId;
	@Column
    private String imsi;
	@Column
    private String ivdId;
	@Column
    private String lastConnectionTime;
	@Column
    private String manufacturer;
	@Column
    private String msisdn;
	@Column
    private String password;
	@Column
    private String serialNumber;
	@Column
    private String status;
	@Column
    private String systemVersion;
	@Column
    private String version;
	@Column
    private String vin;
	@Column
    private String ivdType;
	@Column
    private String licenced;
	@Column
    private String enterpriseId;
	@Column
    private String vrn;
	@Column
    private String enterpriseName;
	@Column
    private String lastHeartbeat;
	@Column
    private String searchIndex;
	@Column
    private String lastModified;
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getExternalId() {
		return externalId;
	}
	public void setExternalId(String externalId) {
		this.externalId = externalId;
	}
	public String getIccId() {
		return iccId;
	}
	public void setIccId(String iccId) {
		this.iccId = iccId;
	}
	public String getImsi() {
		return imsi;
	}
	public void setImsi(String imsi) {
		this.imsi = imsi;
	}
	public String getIvdId() {
		return ivdId;
	}
	public void setIvdId(String ivdId) {
		this.ivdId = ivdId;
	}
	public String getLastConnectionTime() {
		return lastConnectionTime;
	}
	public void setLastConnectionTime(String lastConnectionTime) {
		this.lastConnectionTime = lastConnectionTime;
	}
	public String getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	public String getMsisdn() {
		return msisdn;
	}
	public void setMsisdn(String msisdn) {
		this.msisdn = msisdn;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getSerialNumber() {
		return serialNumber;
	}
	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getSystemVersion() {
		return systemVersion;
	}
	public void setSystemVersion(String systemVersion) {
		this.systemVersion = systemVersion;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getVin() {
		return vin;
	}
	public void setVin(String vin) {
		this.vin = vin;
	}
	public String getIvdType() {
		return ivdType;
	}
	public void setIvdType(String ivdType) {
		this.ivdType = ivdType;
	}
	public String getLicenced() {
		return licenced;
	}
	public void setLicenced(String licenced) {
		this.licenced = licenced;
	}
	public String getEnterpriseId() {
		return enterpriseId;
	}
	public void setEnterpriseId(String enterpriseId) {
		this.enterpriseId = enterpriseId;
	}
	public String getVrn() {
		return vrn;
	}
	public void setVrn(String vrn) {
		this.vrn = vrn;
	}
	public String getEnterpriseName() {
		return enterpriseName;
	}
	public void setEnterpriseName(String enterpriseName) {
		this.enterpriseName = enterpriseName;
	}
	public String getLastHeartbeat() {
		return lastHeartbeat;
	}
	public void setLastHeartbeat(String lastHeartbeat) {
		this.lastHeartbeat = lastHeartbeat;
	}
	public String getSearchIndex() {
		return searchIndex;
	}
	public void setSearchIndex(String searchIndex) {
		this.searchIndex = searchIndex;
	}
	public String getLastModified() {
		return lastModified;
	}
	public void setLastModified(String lastModified) {
		this.lastModified = lastModified;
	}
	
}