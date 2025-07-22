interface FormStepRef {
    validate: () => Promise<boolean>;
    isValid: Ref<boolean>;
    errors: Ref<Record<string, string>>;
    isValidating: Ref<boolean>;
}

interface FormStep {
    id: number;
    label: string;
    icon: string;
    slot: string;
}

interface MultiStepFormValidationOptions {
    totalSteps: number;
    steps: FormStep[];
    onStepChange?: (stepId: number) => void;
    onValidationError?: (stepId: number, errors: string[]) => void;
    onFormSubmit?: () => Promise<void>;
}

export const useMultiStepFormValidation = (
    formRefs: Ref<(FormStepRef | undefined)[]>,
    options: MultiStepFormValidationOptions
) => {
    const { totalSteps, steps, onStepChange, onValidationError, onFormSubmit } = options;

    // State management
    const currentStep = ref(0);
    const completedSteps = ref(new Set<number>());
    const isSubmitting = ref(false);

    // Validation state tracking
    const stepValidationStates = computed(() => {
        const states: Record<number, boolean> = {};
        formRefs.value.forEach((formRef, index) => {
            states[index] = formRef?.isValid.value || false;
        });
        return states;
    });

    // Helper function to check if step is valid
    const isStepValid = (stepIndex: number): boolean => {
        return stepValidationStates.value[stepIndex] || false;
    };

    // Get step class for styling
    const getStepClass = (stepIndex: number): string => {
        if (currentStep.value === stepIndex) {
            return 'bg-primary-600 dark:bg-primary-400 ring-2 ring-primary-300 ring-offset-2';
        } else if (completedSteps.value.has(stepIndex)) {
            return 'bg-green-600 dark:bg-green-400';
        } else if (isStepValid(stepIndex)) {
            return 'bg-blue-500 dark:bg-blue-400';
        } else {
            return 'bg-gray-500 dark:bg-gray-400';
        }
    };

      // Enhanced steps with computed classes
  const enhancedSteps = computed(() => {
      return steps.map(step => ({
          ...step,
          class: computed(() => getStepClass(step.id))
      }));
  });

    // Validate a specific step
    const validateStep = async (stepIndex: number): Promise<boolean> => {
        try {
            const formRef = formRefs.value[stepIndex];
            if (!formRef) {
                // Don't remove from completed if form ref is just not available (component unmounted)
                console.log(`Form ref not available for step ${stepIndex}, keeping completion status`);
                return completedSteps.value.has(stepIndex); // Return current completion status
            }

            const isValid = await formRef.validate();

            if (isValid) {
                completedSteps.value.add(stepIndex);
                console.log(`Step ${stepIndex} validation passed, added to completed`);
            } else {
                // Only remove from completed if there was an actual validation failure
                completedSteps.value.delete(stepIndex);
                console.log(`Step ${stepIndex} validation failed, removed from completed`);
            }

            return isValid;
        } catch (error) {
            console.error(`Validation error for step ${stepIndex}:`, error);
            // Only remove from completed on actual validation errors
            completedSteps.value.delete(stepIndex);
            return false;
        }
    };

    // Validate current step
    const validateCurrentStep = async (): Promise<boolean> => {
        try {
            const isValid = await validateStep(currentStep.value);

            if (!isValid && onValidationError) {
                const formRef = formRefs.value[currentStep.value];
                const errors = formRef?.errors.value ? Object.values(formRef.errors.value) : [];
                onValidationError(currentStep.value, errors);
            }

            return isValid;
        } catch (error) {
            console.error('Current step validation error:', error);
            useToast().add({
                title: "خطأ في التحقق",
                description: "حدث خطأ أثناء التحقق من البيانات",
                color: "error",
            });
            return false;
        }
    };

    // Find first incomplete step
    const findFirstIncompleteStep = async (): Promise<number> => {
        for (let i = 0; i < formRefs.value.length; i++) {
            const formRef = formRefs.value[i];

            if (!formRef) {
                // If component is not mounted, check if it was previously completed
                if (!completedSteps.value.has(i)) {
                    console.log(`Step ${i} not mounted and not completed, marking as incomplete`);
                    return i;
                }
                console.log(`Step ${i} not mounted but was completed, skipping`);
                continue;
            }

            // Component is mounted, validate it
            try {
                const isValid = await formRef.validate();
                if (!isValid) {
                    console.log(`Step ${i} validation failed, marking as incomplete`);
                    return i;
                }
                console.log(`Step ${i} validation passed`);
            } catch (error) {
                console.log(`Step ${i} validation error, marking as incomplete`);
                return i;
            }
        }

        console.log('All steps are complete');
        return -1; // All steps are valid
    };

    // Navigation methods
    const goToStep = (stepId: number) => {
        if (stepId >= 0 && stepId < totalSteps) {
            currentStep.value = stepId;
            onStepChange?.(stepId);
        }
    };

    const nextStep = () => {
        if (currentStep.value < totalSteps - 1) {
            completedSteps.value.add(currentStep.value);
            currentStep.value++;
            onStepChange?.(currentStep.value);
        }
    };

    const previousStep = () => {
        if (currentStep.value > 0) {
            currentStep.value--;
            onStepChange?.(currentStep.value);
        }
    };

    // Smart next validation logic
    const validateAndNext = async () => {
        // FIRST: Check for incomplete previous steps
        const firstIncompleteStep = await findFirstIncompleteStep();

        if (firstIncompleteStep !== -1 && firstIncompleteStep < currentStep.value) {
            goToStep(firstIncompleteStep);
            useToast().add({
                title: "خطوة غير مكتملة",
                description: `يرجى إكمال الخطوة ${firstIncompleteStep + 1} أولاً`,
                color: "warning",
            });
            return false;
        }

        // SECOND: Validate current step
        const currentStepValid = await validateCurrentStep();

        if (!currentStepValid) {
            useToast().add({
                title: "خطأ في الخطوة الحالية",
                description: "يرجى إصلاح الأخطاء في الخطوة الحالية أولاً",
                color: "error",
            });
            return false;
        }

        // THIRD: Move to next step
        nextStep();
        return true;
    };

    // Submit form
    const submitForm = async () => {
        const firstIncompleteStep = await findFirstIncompleteStep();

        if (firstIncompleteStep !== -1) {
            goToStep(firstIncompleteStep);
            useToast().add({
                title: "خطوات غير مكتملة",
                description: `يرجى إكمال الخطوة ${firstIncompleteStep + 1} أولاً`,
                color: "error",
            });
            return false;
        }

        if (onFormSubmit) {
            isSubmitting.value = true;
            try {
                await onFormSubmit();
                useToast().add({
                    title: "تم بنجاح",
                    description: "تم إرسال النموذج بنجاح",
                    color: "success",
                });
                return true;
            } catch (error) {
                useToast().add({
                    title: "خطأ",
                    description: "حدث خطأ أثناء إرسال النموذج",
                    color: "error",
                });
                return false;
            } finally {
                isSubmitting.value = false;
            }
        }

        return true;
    };

    // Reset form
    const resetForm = () => {
        currentStep.value = 0;
        completedSteps.value.clear();
        isSubmitting.value = false;
    };

    // Computed properties
    const progress = computed(() => {
        return (completedSteps.value.size / totalSteps) * 100;
    });

    const canSubmit = computed(() => {
        return completedSteps.value.size === totalSteps;
    });

    const currentStepValidationState = computed(() => {
        return isStepValid(currentStep.value);
    });

    const validStepsCount = computed(() => {
        return Object.values(stepValidationStates.value).filter(Boolean).length;
    });

    // Auto-update completed steps when validation state changes
    // REMOVED: This was causing steps to be removed from completed when components unmount
    // watch(stepValidationStates, (newStates) => {
    //   Object.entries(newStates).forEach(([step, isValid]) => {
    //     const stepNumber = parseInt(step);
    //     if (isValid) {
    //       completedSteps.value.add(stepNumber);
    //     } else {
    //       // Remove from completed if it becomes invalid
    //       completedSteps.value.delete(stepNumber);
    //     }
    //   });
    // }, { deep: true });

    // Only add steps to completed when explicitly validated, don't auto-remove
    // Steps remain completed once validated, even if component unmounts

    return {
        // State
        currentStep: readonly(currentStep),
        completedSteps: readonly(completedSteps),
        isSubmitting: readonly(isSubmitting),

        // Computed
        stepValidationStates: readonly(stepValidationStates),
        enhancedSteps: readonly(enhancedSteps),
        progress,
        canSubmit,
        currentStepValidationState,
        validStepsCount,

        // Methods
        isStepValid,
        getStepClass,
        validateStep,
        validateCurrentStep,
        findFirstIncompleteStep,
        goToStep,
        nextStep,
        previousStep,
        validateAndNext,
        submitForm,
        resetForm,
    };
}; 