package com.honeymoon.tour.controller;

import com.honeymoon.tour.service.FileStorageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PlanController {

    private final FileStorageService storageService;

    public PlanController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * 여정 전체 데이터 조회
     */
    @GetMapping("/plan")
    public ResponseEntity<?> getPlan() {
        Map<String, Object> data = storageService.loadPlan();
        if (data != null) {
            return ResponseEntity.ok(data);
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * 여정 전체 데이터 저장 (DB 대신 JSON & TXT 파일에 저장)
     */
    @PostMapping("/plan")
    public ResponseEntity<?> savePlan(@RequestBody Map<String, Object> planData) {
        boolean saved = storageService.savePlan(planData);
        Map<String, Object> response = new HashMap<>();
        response.put("success", saved);
        response.put("message", saved ? "파일(JSON/TXT)에 성공적으로 저장되었습니다." : "파일 저장 실패");
        return ResponseEntity.ok(response);
    }

    /**
     * 메모장(TXT) 형식 일정 다운로드 엔드포인트
     */
    @GetMapping("/plan/export-txt")
    public ResponseEntity<byte[]> exportTxt() {
        String content = storageService.loadPlanTxt();
        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"honeymoon_itinerary.txt\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }

    /**
     * 헬스 체크
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("storage", "File System (JSON / TXT)");
        return ResponseEntity.ok(status);
    }
}
