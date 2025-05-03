package studysync.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysync.service.AnalyticsReportService;

@RestController
@RequestMapping("/api/analytics-reports")
public class AnalyticsReportController {

    private final AnalyticsReportService analyticsReportService;

    @Autowired
    public AnalyticsReportController(AnalyticsReportService analyticsReportService) {
        this.analyticsReportService = analyticsReportService;
    }

    @GetMapping("/{reportId}/export-pdf")
    public ResponseEntity<String> exportToPDF(@PathVariable Long reportId) {
        String result = analyticsReportService.exportToPDF(reportId);
        return ResponseEntity.ok(result);
    }
} 