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
import com.ericsson.cvc.entity.Device;
import com.ericsson.cvc.service.DeviceService;

@RestController
public class DeviceController {
	
	@Autowired
	private DeviceService deviceService;
	@RequestMapping(value="/device/list",method = RequestMethod.GET) 
	@ResponseStatus(HttpStatus.OK)
	public String list(String vin){
		List<Device> device = deviceService.findList(vin);
		return JSON.toJSONString(device);
	}
	
	@RequestMapping(value="/device/add",method=RequestMethod.POST) 
	@ResponseStatus(code = HttpStatus.CREATED)
	public String create(@RequestBody Device device){
		deviceService.save(device);
		return JSON.toJSONString(device);
	}
}