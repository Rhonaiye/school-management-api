import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  classCode: z.string().min(1, "Class code is required"),
  level: z.number().min(1, "Level must be at least 1"),
});


export const updateClassSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Class name is required').optional(),
    grade: z.number().min(1, 'Grade must be at least 1').optional(),
    section: z.string().optional(),
    teacherId: z.string().uuid('Invalid teacher ID').optional(),
    capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
    academicYear: z.string().min(4, 'Academic year is required').optional(),
    isActive: z.boolean().optional()
  })
});
