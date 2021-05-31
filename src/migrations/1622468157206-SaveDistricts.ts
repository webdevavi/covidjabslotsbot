import { MigrationInterface, QueryRunner } from "typeorm"
import districts from "@data/districts.json"

const flattenedDistricts: { districtId: number; districtName: string }[] = []

Object.values(districts).forEach((dists) => flattenedDistricts.push(...dists))

export class SaveDistricts1622468157206 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    flattenedDistricts.forEach(({ districtId, districtName }) =>
      queryRunner.query(
        `INSERT INTO public.district (id, name) VALUES (${districtId}, '${districtName}');`
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE public.district`)
  }
}
