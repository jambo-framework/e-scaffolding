package com.cgc.tools.codegen.util;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.impl.LogFactoryImpl;

/**
 * <p>
 * Description: �ṩ����channels�Ķ�д����. ��Class������������쳣, ���ǽ��쳣����.
 * </p>
 * 
 * @author Steven
 * @version 1.0
 */
public class WriteFile {
	private static final Log log = LogFactoryImpl.getLog(WriteFile.class);
	private static final int BUFFER_MAX_SIZE = 1024*150 ;

	/**
	 * 
	 */
	private WriteFile(){}

	/**
	 * ��source������д�뵽�Ϸ���dest�ļ���ȥ(��·��).
	 * @param dest
	 * 				Ŀ���ļ���ַ
	 * @param source
	 * 				Ҫд���ļ�������
	 * @return File 
	 * 				���������ɵ��ļ�. 
	 * @throws IOException
	 * 				��һ�п����׳���IO�쳣�׳�
	 */
	public static File write(String dest
			, StringBuffer source ) throws IOException {
		File file = new File(dest);

		if (file.exists()) {
			throw new IllegalArgumentException("�ļ��Ѵ���") ;
		}

		FileOutputStream out = null;
		ByteArrayInputStream input = null;
		try {
			out = new FileOutputStream(file);
			byte[] bytes = source.toString().getBytes();
			input = new ByteArrayInputStream(bytes);
			writeNotFile(input, out) ;
			log.debug("д�����") ;
		} finally {
			if (null != input){
				input.close();
			}
			if (null != out){
				out.close();
			}
			if (null != source){
				source.delete(0, source.length());
			}
			log.debug("�ر�ͨ����Դ") ;
		}
		return file ;
	}

	/**
	 * �����ļ�Input�����ݸ����ļ������д���ļ���ȥ. 
	 * ���Ҫд����ļ��Ѵ���, �Ƿ񸲸����е�����, ȡ�����ṩ��������.
	 * ����ļ��������/д����, ���׳�IO�쳣 
	 * @param input
	 * 				���ļ���������
	 * @param output
	 * 				�ƶ��ļ��������
	 * @throws IOException
	 * 				�׳�һ�п��ܷ�����IO�쳣
	 */
	public static void writeNotFile(InputStream input
			, FileOutputStream output) throws IOException {
		FileChannel channel = null;
		ReadableByteChannel read = null;
		try {
			channel = output.getChannel() ;
			read = Channels.newChannel(input);
//			ByteBuffer buffer = ByteBuffer.allocate(resetBufferSize(input.available()));
//			while (read.read(buffer) != -1) {
//				buffer.flip();
//				channel.write(buffer);
//				buffer.clear();
//			}
			channel.transferFrom(read, 0, input.available()) ;
		} finally {
			if (null != read){
				read.close();
			}
			if (null != channel){
				channel.close();
			}
		}
	}

	/**
	 * ��һ���ļ������ݿ�������һ���ļ���.  
	 * ���Ҫд����ļ��Ѵ���, �Ƿ񸲸����е�����, ȡ�����ṩ��������.
	 * ����ļ��������/д����, ���׳�IO�쳣
	 * @param input
	 * 				Ҫ��ȡ���ļ���
	 * @param output
	 * 				Ҫд����ļ���
	 * @throws IOException
	 * 				�׳�һ�п��ܷ�����IO�쳣
	 */
	public static void write(FileInputStream input
			, FileOutputStream output) throws IOException {
		FileChannel channel = null;
		FileChannel read = null;
		try {
			channel = output.getChannel() ;
			read = input.getChannel() ;
//			ByteBuffer buffer = ByteBuffer.allocate(resetBufferSize(input.available()));
//			while (read.read(buffer) != -1) {
//				buffer.flip();
//				channel.write(buffer);
//				buffer.clear() ;
//			}
			int max_size = input.available() ;
			int read_size = 0 ;
			while (read_size<max_size){
				read_size += read.transferTo(read_size, resetBufferSize(input.available()), channel) ;
			}
		} finally {
			if (null != read){
				read.close();
			}
			if (null != channel){
				channel.close();
			}
		}
	}

	/**
	 * ��ȡ�ļ�������װ��StringBuffer, �����ǽ��ļ�����ֱ��д��StringBuffer
	 * ��, �������ȡ���ļ�����(����100M���ļ�)
	 * @param file
	 * 				����ȡ���ļ�.
	 * @return StringBuffer
	 * 				����һ������ȫ�ļ����ݵ�StringBuffer
	 * @throws IOException
	 * 				�׳�һ�п��ܷ�����IO�����쳣
	 */
	public static StringBuffer read(String file) throws IOException {
		FileInputStream input = null ;
		try {
			input = new FileInputStream(file) ;
			return read(input) ;
		} finally {
			if (null != input){
				input.close() ;
			}
		}
	}

	/**
	 * ��ȡ�������е��ֽ�����װ��StringBuffer, �����ǽ��ļ�����ֱ��д��StringBuffer
	 * ��, �������ȡ̫���������
	 * @param input
	 * 				�ṩ��������
	 * @return StringBuffer
	 * 				����һ���������������ݵ�StringBuffer
	 * @throws IOException
	 * 				�׳�һ�п��ܷ�����IO�����쳣
	 */
	public static StringBuffer read(InputStream input) 
			throws IOException {
		ReadableByteChannel channel = null;
		StringBuffer sb = null ;
		try {
			channel = Channels.newChannel(input);
			sb = new StringBuffer(input.available()) ;
			ByteBuffer bb = ByteBuffer.allocate(resetBufferSize(input.available())) ;
			while (channel.read(bb)!=-1){
				bb.flip() ;
				bb.limit(bb.remaining()) ;
				sb.append(readLimit(bb.remaining(),bb.array())) ;
			}
			bb.clear() ;
		} finally {
			if (null != channel){
				channel.close() ;
			}
		}
		return sb ;
	}

	/**
	 * ����ʵ��byte[]��С��װ�ַ���
	 * @param limit
	 * 				ʵ����Ч����.
	 * @param bytes
	 * 				����װ���ַ�����byte[]
	 * @return String
	 * 				����һ��װ��bytes���ݺ��String
	 */
	private static String readLimit(int limit, byte[] bytes) {
		return new String(bytes,0 , limit) ;
	}

	/**
	 * ȷ����������С, Ŀǰֻ�Ǽ򵥵ĸ����������ĳ���
	 * �����Ĭ�Ͽ�����С���жԱ�, ����Ĭ�Ͽ�����С��, 
	 * ��Ĭ�ϵĿ�����С���ж�ȡ/д�����, ������������
	 * ��Ϊ���������Ƚ��в���
	 * @param input
	 * 				�������ĳ���
	 * @return int 
	 * 				����ȷ���Ļ�������С
	 */
	private static int resetBufferSize(int input) {
		return input > BUFFER_MAX_SIZE? BUFFER_MAX_SIZE: input ;
	}

	/**
	 * ���ԵĲ�������, ����һ�����Ϲ涨��С���ļ�, �ȴ�����
	 * ��������������ļ��Ļ���, ���ٹ���
	 * @param input
	 * @param output
	 * @param bufferLength
	 * @param count
	 * @throws IOException
	 */
	public static void write(InputStream input, OutputStream output
			, int bufferLength , int count) throws IOException {
		WritableByteChannel channel = null;
		ReadableByteChannel read = null;
		try {
			channel = Channels.newChannel(output) ;
			read = Channels.newChannel(input);
			ByteBuffer buffer = ByteBuffer.allocate(bufferLength);
			while (read.read(buffer) != -1) {
				for (int i = 0; i < count; i++){
					buffer.flip();
					channel.write(buffer);
				}
				buffer.clear();
			}
		} finally {
			if (null != read){
				read.close();
			}
			if (null != channel){
				channel.close();
			}
		}
	}

}