import { validateSizeCheckConfig } from './size-check'

describe('#validateSizeCheckConfig', () => {
  it('should validate size check config', () => {
    expect(validateSizeCheckConfig({})).toBe(false)
    expect(validateSizeCheckConfig({ files: [] })).toBe(true)
    expect(validateSizeCheckConfig({ files: [{}] })).toBe(false)
    expect(validateSizeCheckConfig({ files: [{ maxSize: 0 }] })).toBe(false)
    expect(
      validateSizeCheckConfig({ files: [{ test: '*', maxSize: '1 kb' }] }),
    ).toBe(true)
    expect(
      validateSizeCheckConfig({
        files: [{ x: 'y', test: '*', maxSize: '1 kb' }],
      }),
    ).toBe(false)
    expect(
      validateSizeCheckConfig({
        files: [{ test: '*', maxSize: 'xx' }],
      }),
    ).toBe(false)
  })
})
