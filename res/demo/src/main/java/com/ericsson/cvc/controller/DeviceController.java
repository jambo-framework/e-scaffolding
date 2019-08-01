/**
 * auto-generated code
 * Thu Aug 01 12:11:39 CST 2019
 */
package com.ericsson.cvc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.ericsson.cvc.entity.DeviceEntity;
import com.ericsson.cvc.service.DeviceService;

/**
 * <p>Title: DeviceController </p>;
 * <p>Description: Query Parameter</p>
 * <p>Copyright: Copyright (c) 2006</p>
 * <p>Company: ericsson.</p>
 * @author jinbo
 * @version 1.0
 */
@RestController
public class DeviceController {

	@Autowired
	private DeviceService deviceService;
	@RequestMapping(value="/device/list",method = RequestMethod.GET) 
	@ResponseStatus(HttpStatus.OK)
	public String list(){
		List<DeviceEntity> device = deviceService.findAll();
		return JSON.toJSONString(device);
	}
	
	@RequestMapping(value="/device/add",method=RequestMethod.POST) 
	@ResponseStatus(code = HttpStatus.CREATED)
	public String create(@RequestBody DeviceEntity device){
		deviceService.save(device);
		return JSON.toJSONString(device);
	}
}
