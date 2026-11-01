import { describe, it, expect } from '@jest/globals';
import { textTemplateDefinitionFormSchema } from '../text-template-form-schema';

describe('text template definition forms', () => {
  it('name + displayName bắt buộc, các field còn lại tùy chọn', () => {
    const base = {
      name: 't1',
      displayName: 'T1',
      defaultCultureName: '',
      localizationResourceName: '',
      renderEngine: '',
      isInlineLocalized: false,
      isLayout: false,
      layout: '',
    };
    expect(textTemplateDefinitionFormSchema.safeParse({ ...base, name: '' }).success).toBe(false);
    expect(textTemplateDefinitionFormSchema.safeParse({ ...base, displayName: '' }).success).toBe(false);
    expect(textTemplateDefinitionFormSchema.safeParse(base).success).toBe(true);
    expect(
      textTemplateDefinitionFormSchema.safeParse({ ...base, isLayout: true, layout: 'main' }).success,
    ).toBe(true);
  });
});
