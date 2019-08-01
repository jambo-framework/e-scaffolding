/**
 * auto-generated code  
 * Thu Aug 01 12:11:39 CST 2019
 */
package com.ericsson.cvc.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ericsson.cvc.entity.DeviceEntity;

/**
 * <p>Title: DeviceRepository</p>
 * <p>Description: Data Access Object</p>
 * <p>Copyright: Copyright (c) 2006</p>
 * <p>Company: ericsson.</p>
 * @author jinbo
 * @version 1.0
 */
public interface DeviceRepository extends JpaRepository<DeviceEntity, Integer> {


    
    public DeviceEntity findById(String id);
    
    public DeviceEntity save(DeviceEntity obj);
    
    
}
