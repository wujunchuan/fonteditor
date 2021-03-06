/**
 * @file 射线法判断点是否在path内部
 * @author mengke01(kekee000@gmail.com)
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM01/Chap1.html
 */

import pathIterator from './pathIterator';
import isBezierRayCross from './isBezierRayCross';
import isSegmentRayCross from './isSegmentRayCross';

/**
 * 判断点是否在path内部
 * 以p点的x轴向右射线为起点
 *
 * @param {Object} path path对象
 * @param {Object} p 点对象
 * @return {boolean} 是否
 */
export default function isInsidePath(path, p) {

    let zCount = 0;
    let joint;

    pathIterator(path, function (c, p0, p1, p2) {
        if (c === 'L') {

            if ((joint = isSegmentRayCross(p0, p1, p))) {

                if (joint.length === 2) {
                    // 水平重叠
                    if (
                        p.x >= Math.min(joint[0].x, joint[1].x)
                        && p.x <= Math.max(joint[0].x, joint[1].x)
                    ) {
                        zCount = 1;
                        return false;
                    }

                    return;
                }

                // 在直线上
                if (joint[0].x === p.x) {
                    zCount = 1;
                    return false;
                }

                if (p1.y > p0.y) {
                    zCount--;
                }
                else {
                    zCount++;
                }
            }
        }
        else if (c === 'Q') {

            let ps = null;
            let pe = null;

            // 确定贝塞尔曲线的方向点
            if ((joint = isBezierRayCross(p0, p1, p2, p))) {

                // 在曲线上
                if (joint[0].x === p.x || joint[1] && joint[1].x === p.x) {
                    zCount = 1;
                    return false;
                }

                if (joint.length === 2) {
                    return;
                }

                joint = joint[0];

                if (joint.y > p0.y && joint.y < p1.y) {
                    ps = p0;
                    pe =  p1;
                }
                else {
                    ps = p1;
                    pe =  p2;
                }

                if (pe.y > ps.y) {
                    zCount--;
                }
                else {
                    zCount++;
                }

            }
        }
    });

    return !!zCount;
}
