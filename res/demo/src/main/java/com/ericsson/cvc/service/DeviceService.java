package com.ericsson.cvc.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ericsson.cvc.dao.DeviceRepository;
import com.ericsson.cvc.entity.Device;

/**
 * service
 * @author tool
 * @version 2019-7-22
 */
@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    public Device findDeviceById(String id){

        return deviceRepository.findById(id);
    }

    //search data,return list type json
    public List<Device> findList(String vin){
    	if(StringUtils.isEmpty(vin)) {
    		return deviceRepository.findAll();
    	}
        return deviceRepository.findName(vin);
    }

    @Transactional(readOnly = false)
    public void delete(Device device){
    	deviceRepository.delete(device);
    }
    @Transactional(readOnly = false)
    public void save(Device device){
    	deviceRepository.save(device);
    }
    @Transactional(readOnly = false)
    public void updateList(Device device){
    	Device d = this.findDeviceById(device.getId());
    	BeanUtils.copyProperties(device, d);
    	deviceRepository.save(device);
    }

}
