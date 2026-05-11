using Kitlo.Core.Enums;

namespace Kitlo.Core.Catalogue;

/// <summary>
/// Maps each <see cref="Vertical"/> to the <see cref="GearType"/> values listers may
/// publish under it. The backend is the source of truth for which combinations are
/// valid — frontend pickers use a mirror of this map for filtering, but the publish
/// path validates here.
/// </summary>
public static class VerticalRules
{
    public static readonly IReadOnlyDictionary<Vertical, GearType[]> VerticalToGearTypes =
        new Dictionary<Vertical, GearType[]>
        {
            [Vertical.Overlanding] = new[]
            {
                GearType.RooftopTent,
                GearType.Awning,
                GearType.Fridge12V,
                GearType.DualBattery,
                GearType.RecoveryBoard,
                GearType.AirCompressor,
                GearType.Navigation,
                GearType.CampKitchen,
                GearType.OverlandKit,
                GearType.Other
            },
            [Vertical.HuntingOptics] = new[]
            {
                GearType.Thermal,
                GearType.NightVision,
                GearType.Optics,
                GearType.ThermalMonocular,
                GearType.ThermalScope,
                GearType.ClipOnThermal,
                GearType.NvScope,
                GearType.ClipOnNv,
                GearType.TreeStand,
                GearType.Pack,
                GearType.Other
            },
            [Vertical.PowerStation] = new[]
            {
                GearType.PowerStation,
                GearType.SolarPanel,
                GearType.DualBattery,
                GearType.Other
            },
            [Vertical.FlyFishing] = new[]
            {
                GearType.Wader,
                GearType.WadingBoot,
                GearType.FlyRodReel,
                GearType.FlyPack,
                GearType.SpecialtyWeight,
                GearType.FloatTube,
                GearType.Other
            }
        };

    public static bool IsValid(Vertical vertical, GearType gearType)
    {
        return VerticalToGearTypes.TryGetValue(vertical, out var allowed) &&
               Array.IndexOf(allowed, gearType) >= 0;
    }
}
