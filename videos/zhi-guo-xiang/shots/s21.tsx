/* S21 · 同一时刻：她按着一枚针，扎进落水者的穴道 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';

/* 底图 p-rescue 里她手里已经画着那枚针，代码不再叠第二枚——旧版叠出来的是画面中间一根悬空的针。 */
const S21: FC = () => (
  <Scene name="p-rescue" zoom={[1.02, 1.08]} dim={0.04} />
);

export default S21;
