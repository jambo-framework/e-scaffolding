/**
 * auto-generated code
 * Thu Aug 01 12:11:39 CST 2019
 */
package com.ericsson.cvc.service;

import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ericsson.cvc.dao.DeviceRepository;
import com.ericsson.cvc.entity.DeviceEntity;

/**
 * <p>Title: DeviceService </p>;
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2006</p>
 * <p>Company: ericsson.</p>
 * @author jinbo
 * @version 1.0
 */

@Service
public class DeviceService  {
    @Autowired
    private DeviceRepository deviceRepository;

    public List<DeviceEntity> findAll(){
        return deviceRepository.findAll();
    }
    @Transactional(readOnly = false)
    public void save(DeviceEntity device){
    	deviceRepository.save(device);
    }
}
