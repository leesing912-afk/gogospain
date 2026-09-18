package com.honeymoon.tour.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Service
public class FileStorageService {

    @Value("${app.storage.dir:data}")
    private String storageDir;

    private final ObjectMapper objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);

    private static final String PLAN_JSON = "honeymoon_plan.json";
    private static final String PLAN_TXT = "honeymoon_itinerary.txt";

    @PostConstruct
    public void init() {
        try {
            Path dirPath = Paths.get(storageDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
        } catch (IOException e) {
            System.err.println("저장 디렉토리 생성 실패: " + e.getMessage());
        }
    }

    /**
     * 여행 계획 JSON 및 메모장 TXT 파일 저장
     */
    public synchronized boolean savePlan(Map<String, Object> data) {
        try {
            Path jsonPath = Paths.get(storageDir, PLAN_JSON);
            objectMapper.writeValue(jsonPath.toFile(), data);

            // 메모장(TXT) 파일로도 동시 생성/저장
            generateAndSaveTxt(data);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 저장된 여행 계획 JSON 읽기
     */
    @SuppressWarnings("unchecked")
    public synchronized Map<String, Object> loadPlan() {
        try {
            File file = Paths.get(storageDir, PLAN_JSON).toFile();
            if (file.exists() && file.length() > 0) {
                return objectMapper.readValue(file, Map.class);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 메모장(TXT) 내용 조회
     */
    public synchronized String loadPlanTxt() {
        try {
            Path txtPath = Paths.get(storageDir, PLAN_TXT);
            if (Files.exists(txtPath)) {
                return Files.readString(txtPath, StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "저장된 메모장 텍스트 일정이 없습니다.";
    }

    /**
     * 메모장(TXT) 포맷으로 변환 후 파일 저장
     */
    private void generateAndSaveTxt(Map<String, Object> data) {
        try {
            StringBuilder sb = new StringBuilder();
            sb.append("==================================================\n");
            sb.append("✈️ 서유럽 이베리아 15일 신혼여행 일정표 (메모장 저장본)\n");
            sb.append("==================================================\n\n");

            if (data.containsKey("headerPass")) {
                Map<?, ?> pass = (Map<?, ?>) data.get("headerPass");
                sb.append("[ 여정 및 항공 요약 ]\n");
                sb.append("• ").append(pass.get("inCity")).append(": ").append(pass.get("inDate"))
                  .append(" (").append(pass.get("inFlight")).append(")\n");
                sb.append("• ").append(pass.get("outCity")).append(": ").append(pass.get("outDate"))
                  .append(" (").append(pass.get("outFlight")).append(")\n");
                sb.append("• 기간: ").append(pass.get("periodVal")).append(" / 동선: ").append(pass.get("routeVal")).append("\n\n");
            }

            if (data.containsKey("budget")) {
                Map<?, ?> budget = (Map<?, ?>) data.get("budget");
                sb.append("[ 총 예상 경비 ]\n");
                sb.append("▶ 합계: ").append(budget.get("totalText")).append("\n");
                sb.append("※ ").append(budget.get("note")).append("\n\n");
            }

            Path txtPath = Paths.get(storageDir, PLAN_TXT);
            Files.writeString(txtPath, sb.toString(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            System.err.println("메모장 TXT 생성 오류: " + e.getMessage());
        }
    }
}
