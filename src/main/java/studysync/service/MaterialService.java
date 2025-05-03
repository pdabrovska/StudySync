package studysync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysync.model.Material;
import studysync.model.Course;
import studysync.repository.MaterialRepository;
import studysync.repository.CourseRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {
    
    private final MaterialRepository materialRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public MaterialService(MaterialRepository materialRepository, CourseRepository courseRepository) {
        this.materialRepository = materialRepository;
        this.courseRepository = courseRepository;
    }

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public Optional<Material> getMaterialById(Long id) {
        return materialRepository.findById(id);
    }

    public List<Material> getMaterialsByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        return course.getMaterials();
    }

    public Material createMaterial(Long courseId, Material material) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        material.setCourse(course);
        return materialRepository.save(material);
    }

    public Material updateMaterial(Long id, Material updatedMaterial) {
        return materialRepository.findById(id)
                .map(material -> {
                    material.setTitle(updatedMaterial.getTitle());
                    material.setType(updatedMaterial.getType());
                    material.setLink(updatedMaterial.getLink());
                    return materialRepository.save(material);
                })
                .orElseThrow(() -> new IllegalArgumentException("Material not found"));
    }

    public void deleteMaterial(Long id) {
        if (!materialRepository.existsById(id)) {
            throw new IllegalArgumentException("Material not found");
        }
        materialRepository.deleteById(id);
    }
} 