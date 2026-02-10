# 数值运算
> 引入 [mathjs](https://mathjs.org/index.html) 处理四则运算中的精度问题, `API` 参考测试用例

```typescript
import Calculator from '@/utils/math'

console.log(Calculator.add(0.1, 0.2)) // 0.3
```

执行测试用例:

```bash
pnpm run test
```

## API
可直接参考测试用例(`src/utils/math.test.ts`):

<<< @/../src/utils/math.test.ts
