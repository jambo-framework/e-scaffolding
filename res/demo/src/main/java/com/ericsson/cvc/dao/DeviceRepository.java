package com.ericsson.cvc.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ericsson.cvc.entity.Device;
 
@Repository
public interface DeviceRepository extends JpaRepository<Device, Integer>{
    
    public Device findById(String id);
    
    public Device save(Device device);
    
//    public Device update(Device device);
    
    @Query(value = "SELECT device FROM Device device WHERE vin=:vin")
    public List<Device> findName(@Param("vin") String vin);

	@Query(value = "SELECT * FROM Device WHERE vrn=?", nativeQuery = true)
	public Device findNativedName(String vrn);
 
}