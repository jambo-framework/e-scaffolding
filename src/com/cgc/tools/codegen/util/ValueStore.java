package com.cgc.tools.codegen.util;

import java.sql.Connection;
import java.util.List;

public class ValueStore {
	public static Connection connection; // ����

	public static String tableName; // ����

	public static String baseClassName; // ��������,�����඼����������

	public static String moduleName; // ģ������,�������Ŀ¼������ͬ��

	// ������·��
	public static String srcFolder;

	public static String testFolder;

	public static String webFolder;

	// �����ļ��Ƿ�����,�����ɵ��ļ�
	public static boolean[] genOrNot = new boolean[10];

	// Hibernate�ļ��Ƿ����ֶ�ǰ׺
	public static boolean reservePrefix = false;
	
	public static int numPrefix ;

	// ����ֶ��б�,ͨ��������VO���ֶκ�ListVO���ֶ�
	public static List fields;

	public static String author;

	// ʹ��JSF����ʹ��struts
	public static String framework;

	public static String pkFields;

	//2013-4-26 jinbo ����ģ��Ŀ¼,�������ָ��ģ���λ��
    public static String templatePath;
    //��Ŀ����
    public static String projname;

	// �Ƿ��Ϊ����ע�����͵�POJO
    public static boolean isAnnotation = true;
}
