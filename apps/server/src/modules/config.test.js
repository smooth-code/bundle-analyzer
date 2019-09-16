import { validateConfig } from './config'

describe('#validateConfig', () => {
  it('should validate size check config', () => {
    expect(validateConfig({}).valid).toBe(false)
    expect(validateConfig({ files: [] }).valid).toBe(true)
    expect(validateConfig({ files: [{}] }).valid).toBe(false)
    expect(validateConfig({ files: [{ maxSize: 0 }] }).valid).toBe(false)
    expect(
      validateConfig({ files: [{ test: '*', maxSize: '1 kb' }] }).valid,
    ).toBe(true)
    expect(
      validateConfig({
        files: [{ x: 'y', test: '*', maxSize: '1 kb' }],
      }).valid,
    ).toBe(false)
    expect(
      validateConfig({
        files: [{ test: '*', maxSize: 'xx' }],
      }).valid,
    ).toBe(false)
  })
})
