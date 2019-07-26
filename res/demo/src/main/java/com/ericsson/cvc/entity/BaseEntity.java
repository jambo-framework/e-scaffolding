package com.ericsson.cvc.entity;


import java.io.Serializable;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import org.hibernate.annotations.GenericGenerator;

 
@MappedSuperclass
public class BaseEntity implements Serializable{
    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
    @GeneratedValue(generator="uuid")
    @GenericGenerator(name="uuid",strategy="uuid")
    protected String id;
    
 
    public String getId() {
        return id;
    }
 
    public void setId(String id) {
        this.id = id;
    }
 
    
}